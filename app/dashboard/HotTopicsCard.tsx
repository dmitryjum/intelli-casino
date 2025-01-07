
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
// import dynamic from 'next/dynamic'
import { prisma } from '@/lib/db'
import CustomWordCloud from '@/components/CustomWordCloud';
// const CustomWordCloud = dynamic(() => import('@/components/CustomWordCloud'), {ssr: false})

type Props = {}

const HotTopicsCard = async (props: Props) => {
  const topics = await prisma.topicCount.findMany({})
  const formattedTopics = topics.map(topic => {
    return {
      text: topic.topic,
      value: topic.count
    }
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it!
        </CardDescription>
      </CardHeader>

      <CardContent className='pl-2 [&_text]:cursor-pointer'>
        <CustomWordCloud formattedTopics={formattedTopics}/>
      </CardContent>
    </Card>
  )
}

export default HotTopicsCard