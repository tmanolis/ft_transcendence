import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MatchHistoryStyled, HistoryScrollingList, MatchElement } from './styles/MatchHistory.styled';

const MatchHistory: React.FC = () => {

  return (
    <MatchHistoryStyled>
        <h1>Match History</h1>
        <HistoryScrollingList>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
            <MatchElement></MatchElement>
        </HistoryScrollingList>
    </MatchHistoryStyled>
  );
};

export default MatchHistory;