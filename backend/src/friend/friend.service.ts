import {
  Injectable,
  Res,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Response } from 'express';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

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
    const sender: User = user;
    const receiver: User = await this.getUserByEmail(receiverEmail);
    if (!receiver) {
      throw new BadRequestException('Receiver not found.');
    }

    // check if receiver's receivedRequest array contains the sender's email
    if (receiver.friendRequestsReceived.includes(senderEmail)) {
      throw new BadRequestException(
        "Friend request already in receiver's list",
      );
    }

    // check if sender's sentRequest array contains the receiver's email
    if (sender.friendRequestsSent.includes(receiverEmail)) {
      throw new BadRequestException("Friend request already in sender's list.");
    }

    // check if receiver was the sender
    if (
      receiver.friendRequestsSent.includes(senderEmail) ||
      sender.friendRequestsReceived.includes(receiverEmail)
    ) {
      throw new BadRequestException('The receiver sent you an request.');
    }

    // check if they are already friends
    if (
      sender.friends.includes(receiverEmail) ||
      receiver.friends.includes(senderEmail)
    ) {
      throw new BadRequestException('You are already friends.');
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
    } catch (error) {
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
    } catch (error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    return {
      status: 'OK',
      statusCode: 200,
      message: 'Friend request successufly sent.',
    };
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

    const sender: User = user;
    const receiver: User = await this.getUserByEmail(receiverEmail);
    if (!receiver) {
      throw new BadRequestException('Receiver not found.');
    }

    // check if sender and receiver's sentRequest/receivedRequest array 
    // contain the corresponding email
    if (
      !sender.friendRequestsSent.includes(receiverEmail) ||
      !receiver.friendRequestsReceived.includes(senderEmail)
    ) {
      throw new BadRequestException('Friend request not existant.');
    }

    // check if they are already friends
    if (
      sender.friends.includes(receiverEmail) ||
      receiver.friends.includes(senderEmail)
    ) {
      throw new BadRequestException('You are already friends.');
    }

    // remove request from sender/receiver list
    await this.removeRequestFromBothList(sender, receiver);

    return {
      status: 'OK',
      statusCode: 200,
      message: 'Friend request successufly canceled.',
    };
  }

  /*****************************************************************************/
  /* accept friend Request */
  /*****************************************************************************/
  async acceptFriendRequest(
    user: User,
    payload: { userEmail: string },
    res: Response,
  ) {
    // check user/payload data
    const checkData = await this.checkSenderAndReceiver(user, payload);
    if (checkData !== '') {
      throw new BadRequestException(checkData);
    }

    const senderEmail: string = payload.userEmail;
    const receiverEmail: string = user.email;

    const receiver: User = user;
    const sender: User = await this.getUserByEmail(senderEmail);
    if (!sender) {
      throw new BadRequestException('Sender not found.');
    }

    // check if sender and receiver's sentRequest/receivedRequest array
    // contain the corresponding email
    if (
      !sender.friendRequestsSent.includes(receiverEmail) ||
      !receiver.friendRequestsReceived.includes(senderEmail)
    ) {
      throw new BadRequestException('Friend request not existant.');
    }

    // check if receiver was the sender
    if (
      receiver.friendRequestsSent.includes(senderEmail) ||
      sender.friendRequestsReceived.includes(receiverEmail)
    ) {
      throw new BadRequestException('The receiver sent you an request.');
    }

    // check if they are already friends
    if (
      sender.friends.includes(receiverEmail) ||
      receiver.friends.includes(senderEmail)
    ) {
      throw new BadRequestException('You are already friends.');
    }

    // remove request from sender/receiver list
    await this.removeRequestFromBothList(sender, receiver);

    // update/add sender to receiver's friends list
    try {
      const addFriendResult = await this.prisma.user.update({
        where: {
          email: receiverEmail,
        },
        data: {
          friends: {
            push: senderEmail,
          },
        },
      });
      if (add.FriendResult.friends.length === 1) {
        console.log("Added my first friend.");
        // Add FRIEND achievement.
        // Should probably create an achievement module for this.
      }
    } catch (error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    // update/add receiver to sender's friends list
    try {
      const addFriendResult = await this.prisma.user.update({
        where: {
          email: senderEmail,
        },
        data: {
          friends: {
            push: receiverEmail,
          },
        },
      if (addFriendResult.friends.length === 1) {
        console.log("Added my first friend.");
        // Add FRIEND achievement.
        // Should probably create an achievement module for this.
      }
      });
    } catch (error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    return {
      status: 'OK',
      statusCode: 200,
      message: 'Friend request successufly accepted.',
    };
  }

  /*****************************************************************************/
  /* decline friend Request */
  /*****************************************************************************/
  async declineFriendRequest(
    user: User,
    payload: { userEmail: string },
    res: Response,
  ) {
    // check user/payload data
    const checkData = await this.checkSenderAndReceiver(user, payload);
    if (checkData !== '') {
      throw new BadRequestException(checkData);
    }

    const senderEmail: string = payload.userEmail;
    const receiverEmail: string = user.email;

    const receiver: User = user;
    const sender: User = await this.getUserByEmail(senderEmail);
    if (!sender) {
      throw new BadRequestException('Sender not found.');
    }

    // check if sender and receiver's sentRequest/receivedRequest array
    // contain the corresponding email
    if (
      !sender.friendRequestsSent.includes(receiverEmail) ||
      !receiver.friendRequestsReceived.includes(senderEmail)
    ) {
      throw new BadRequestException('Friend request not existant.');
    }

    // check if receiver was the sender
    if (
      receiver.friendRequestsSent.includes(senderEmail) ||
      sender.friendRequestsReceived.includes(receiverEmail)
    ) {
      throw new BadRequestException('The receiver sent you an request.');
    }

    // check if they are already friends
    if (
      sender.friends.includes(receiverEmail) ||
      receiver.friends.includes(senderEmail)
    ) {
      throw new BadRequestException('You are already friends.');
    }

    // remove request from sender/receiver list
    await this.removeRequestFromBothList(sender, receiver);

    return {
      status: 'OK',
      statusCode: 200,
      message: 'Friend request successufly declined.',
    };
  }
  /*****************************************************************************/
  /* unfriend */
  /*****************************************************************************/
  async unfriend(
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

    const sender: User = user;
    const receiver: User = await this.getUserByEmail(receiverEmail);
    if (!sender) {
      throw new BadRequestException('Sender not found.');
    }

    // check if they are friends
    if (
      !sender.friends.includes(receiverEmail) ||
      !receiver.friends.includes(senderEmail)
    ) {
      throw new BadRequestException('You are not friends.');
    }

    // update/add sender to receiver's friends list
    try {
      await this.prisma.user.update({
        where: {
          email: receiverEmail,
        },
        data: {
          friends: {
            set: receiver.friends.filter(
              (senderEmailInArray) => senderEmailInArray !== sender.email,
            ),
          },
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    // update/add receiver to sender's friends list
    try {
      await this.prisma.user.update({
        where: {
          email: senderEmail,
        },
        data: {
          friends: {
            set: sender.friends.filter(
              (receiverEmailInArray) => receiverEmailInArray !== receiver.email,
            ),
          },
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    return {
      status: 'OK',
      statusCode: 200,
      message: 'Goodbye my friend.',
    };
  }

  /*****************************************************************************/
  // helper functions
  /*****************************************************************************/
  async checkSenderAndReceiver(user: User, payload: { userEmail: string }) {
    let result: string = '';
    // check data integrity
    if (!user || !user.email || !payload || !payload.userEmail) {
      result = 'Bad data.';
    }

    if (user.email === payload.userEmail) {
      result = 'You are always your own best friend!';
    }

    return result;
  }

  async removeRequestFromBothList(sender: User, receiver: User) {
    // update receiver's list
    try {
      await this.prisma.user.update({
        where: {
          email: receiver.email,
        },
        data: {
          friendRequestsReceived: {
            set: receiver.friendRequestsReceived.filter(
              (senderEmailInArray) => senderEmailInArray !== sender.email,
            ),
          },
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }

    // update sender's list
    try {
      await this.prisma.user.update({
        where: {
          email: sender.email,
        },
        data: {
          friendRequestsSent: {
            set: sender.friendRequestsSent.filter(
              (receiverEmailInArray) => receiverEmailInArray !== receiver.email,
            ),
          },
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException('Server unavailable.');
    }
  }

  async getUserByEmail(email: string) : Promise<User> {
    let user: User = null;
    try {
      user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Server unavailable.');
    }
    return user;
  }
}
