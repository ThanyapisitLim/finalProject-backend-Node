import { Request, Response, NextFunction } from 'express';
import { groupVotesByPoll, getAllVote } from './vote';
import { getQuestionByPollId } from './poll';

interface RawVoteData {
    _id: string;
    userId: string;
    pollId: string;
    selectedOption: string;
    timestamp: string;
    previousHash: string | null;
    currentHash: string;
}


export const visualizeAllVotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawVotes = await getAllVote();
        const groupedResults = groupVotesByPoll(rawVotes as RawVoteData[]);
        const pollIds = Object.keys(groupedResults);

        const pollQuestionPromises = pollIds.map(pollId =>
            getQuestionByPollId(pollId)
        );

        const pollQuestions = await Promise.all(pollQuestionPromises);
        const pollTitles: { [key: string]: string } = {};
        pollIds.forEach((pollId, index) => {
            const question = pollQuestions[index];
            pollTitles[pollId] = question || `Unknown Poll (${pollId})`;
        });

        //Render หน้า EJS
        res.render('blockchain_view', {
            title: "Blockchain Vote Chain Structure",
            groupedResults: groupedResults,
            pollTitles: pollTitles,
        });

    } catch (error) {
        next(error);
    }
};