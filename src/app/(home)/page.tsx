'use client'

import NavCard from '@/components/nav-card'
import HiCard from '@/app/(home)/hi-card'
import ArtCard from '@/app/(home)/art-card'
import ClockCard from '@/app/(home)/clock-card'
import CalendarCard from '@/app/(home)/calendar-card'
import AritcleCard from '@/app/(home)/aritcle-card'
import WriteButtons from '@/app/(home)/write-buttons'
import { useSize } from '@/hooks/use-size'

export default function Home() {
  const { maxSM } = useSize()

  return (
    <div className="flex h-screen">
      {/* 左侧导航栏 */}
      <div className="w-64 bg-gray-100 flex flex-col justify-between py-12">
        <div className="flex flex-col items-center gap-6">
          <span className="text-xl font-bold">hikari</span>
          {/* 这里放其他导航项 */}
        </div>
        <div className="flex flex-col items-center gap-6">
          <span className="text-sm">推荐分享</span>
          {/* 这里放底部的块 */}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col justify-between py-12">
        {/* 顶部区域 */}
        <div className="flex flex-col items-center gap-6">
          <HiCard />
          <ArtCard />
        </div>

        {/* 底部区域 */}
        <div className="flex flex-col items-center gap-6">
          {!maxSM && <ClockCard />}
          {!maxSM && <CalendarCard />}
          <AritcleCard />
          {!maxSM && <WriteButtons />}
        </div>
      </div>
    </div>
  )
}
