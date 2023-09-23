import { Injectable, Res, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Response } from 'express';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  /*****************************************************************************/
  // helper functions
  /*****************************************************************************/
  async checkSenderAndReceiver(user: User, payload: { userEmail: string}){
    let result: string = '';
    // check data integrity
    if (!user || !(user.email) || !payload || !(payload.userEmail) ) {
      result = 'Bad data.';
    }

    const senderEmail: string = user.email;
    const receiverEmail: string = payload.userEmail;
    if (senderEmail === receiverEmail) {
      result = 'Can not send request to your self.';
    }

    return result;

  }

  /*****************************************************************************/
  /* send friend Request */
  /*****************************************************************************/
  async sendFriendRequest(
    user: User,
    payload: { userEmail: string },
    res: Response,
  ) {
    // check user/payload data
    const checkData = await this.checkSenderAndReceiver(user, payload);
    if (checkData !== '') {
      throw new BadRequestException(checkData);
    }

    const senderEmail: string = user.email;
    const receiverEmail: string = payload.userEmail;

    // find the receiver in database
    let sender: User = user;
    let receiver: User;
    try {
      receiver = await this.prisma.user.findUnique({
        where: {
          email: receiverEmail,
        },
      });
    } catch(error) {
      console.log(error);
      throw new ServiceUnavailableException('Server unavailable.');
    }
    if (!receiver) {
      throw new BadRequestException('Receiver not found.');
    }

    // check if receiver's receivedRequest array contains the sender's email
    if (receiver.friendRequestsReceived.includes(senderEmail)) {
      throw new BadRequestException("Friend request already in receiver's list");
    }

    // check if sender's sentRequest array contains the receiver's email
    if (sender.friendRequestsSent.includes(receiverEmail)) {
      throw new BadRequestException("Friend request already in sender's list.");
    }

    // update receiver's list
    try {
      const updateReceiver = await this.prisma.user.update({
        where: {
          email: receiverEmail,
        },
        data: {
          friendRequestsReceived: {
            push: senderEmail,
          },
        },
      });
    } catch(error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    // update sender's list
    try {
      const updateReceiver = await this.prisma.user.update({
        where: {
          email: senderEmail,
        },
        data: {
          friendRequestsSent: {
            push: receiverEmail,
          },
        },
      });
    } catch(error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    return { status: 'OK', statusCode: 200, message: 'Friend request successufly sent.' };
  }
  /*****************************************************************************/
  /* cancel friend Request */
  /*****************************************************************************/
  async cancelFriendRequest(
    user: User,
    payload: { userEmail: string },
    res: Response,
  ) {
    // check user/payload data
    const checkData = await this.checkSenderAndReceiver(user, payload);
    if (checkData !== '') {
      throw new BadRequestException(checkData);
    }

    const senderEmail: string = user.email;
    const receiverEmail: string = payload.userEmail;

    // find the receiver in database
    let sender: User = user;
    let receiver: User;
    try {
      receiver = await this.prisma.user.findUnique({
        where: {
          email: receiverEmail,
        },
      });
    } catch(error) {
      console.log(error);
      throw new ServiceUnavailableException('Server unavailable.');
    }
    if (!receiver) {
      throw new BadRequestException('Receiver not found.');
    }

    // check if receiver's receivedRequest array contains the sender's email
    if (!(receiver.friendRequestsReceived.includes(senderEmail))) {
      throw new BadRequestException("Friend request not in receiver's list");
    }

    // check if sender's sentRequest array contains the receiver's email
    if (!(sender.friendRequestsSent.includes(receiverEmail))) {
      throw new BadRequestException("Friend request not in sender's list.");
    }

    // update receiver's list
    try {
      const updateReceiver = await this.prisma.user.update({
        where: {
          email: receiverEmail,
        },
        data: {
          friendRequestsReceived: {
            set: receiver.friendRequestsReceived.filter(
              (senderEmailInArray) => senderEmailInArray !== senderEmail,
            ),
          },
        },
      });
    } catch(error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    // update sender's list
    try {
      const updateReceiver = await this.prisma.user.update({
        where: {
          email: senderEmail,
        },
        data: {
          friendRequestsSent: {
            set: sender.friendRequestsSent.filter(
              (receiverEmailInArray) => receiverEmailInArray !== receiverEmail,
            ),
          },
        },
      });
    } catch(error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    return { status: 'OK', statusCode: 200, message: 'Friend request successufly canceled.' };
  }

}
