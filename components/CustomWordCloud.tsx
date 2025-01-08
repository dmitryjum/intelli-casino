'use client';
import { useUserContext } from '@/app/context/UserContext';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Role } from '@prisma/client'
import dynamic from 'next/dynamic'
const D3WordCloud = dynamic(() => import('react-d3-cloud'), {ssr: false});

interface WordData {
  text: string,
  value: number
}

type Props = {
  formattedTopics: WordData[]
}

const fontSizeMapper = (word: {value: number}) => {
  return Math.log2(word.value) * 5 + 16
}

const CustomWordCloud = ({formattedTopics}: Props) => {
  const theme = useTheme()
  const router = useRouter();
  const { userRole } = useUserContext();
  return (
    <>
      <D3WordCloud
       data={formattedTopics}
       height={550}
       font="Times"
       fontSize={fontSizeMapper}
       rotate={0}
       padding={10}
       onWordClick={(event, word) => {
        if (userRole === Role.PLAYER) router.push(`/quiz?topic=${word.text}`);
       }}
       fill={theme.theme === 'dark' ? 'white' : 'black'} />
    </>
  )
}

export default CustomWordCloud