'use client';
import React, { useEffect, useState } from 'react';
import keyword_extractor from 'keyword-extractor';
import { useUserContext } from '@/app/context/UserContext';
import { Role } from '@prisma/client';

type Props = {
  answer: string;
  // setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const BLANKS = '_____';

const BlankAnswerInput = ({ answer }: Props) => {
  const { userRole } = useUserContext();
  // const [answerWithBlanks, setAnswerWithBlanks] = useState<string>(answer);
  // Calculate keywords and blanks only on the client side
  // useEffect(() => {
  //   const extractedKeywords = keyword_extractor.extract(answer, {
  //     language: "english",
  //     remove_digits: true,
  //     return_changed_case: false,
  //     remove_duplicates: false,
  //   });
  //   const shuffledKeywords = extractedKeywords.sort(() => Math.random() - 0.5);
  //   const selectedKeywords = shuffledKeywords.slice(0, 2);


  //   const updatedAnswerWithBlanks = selectedKeywords.reduce((acc, keyword) => {
  //     return acc.replace(keyword, BLANKS);
  //   }, answer);

  //   setAnswerWithBlanks(updatedAnswerWithBlanks);
  //   setBlankAnswer(updatedAnswerWithBlanks);
  // }, [answer, setBlankAnswer]);

  return (
    <div className="flex justify-start w-full mt-4">
      <h1 className="text-xl font-semibold">
        {
          answer.split(BLANKS).map((part, index) => {
            return (
              <React.Fragment key={index}>
                {part}
                {index === answer.split(BLANKS).length - 1 ? null : (
                  <input
                    disabled={userRole === Role.SPECTATOR}
                    type="text"
                    id="user-blank-input"
                    className={"text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"}
                  />
                )}
              </React.Fragment>
            );
          })
        }
      </h1>
    </div>
  );
};

export default BlankAnswerInput;