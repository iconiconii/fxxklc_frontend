"use client"

import type React from "react"

import { BarChart3, Trophy, RefreshCw, Settings, HelpCircle, Menu, Code, Zap, StickyNote, Globe, CheckCircle, Brain, History } from "lucide-react"

import { Home } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="https://kokonutui.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-center gap-3">
              <Image
                src="https://kokonutui.com/logo.svg"
                alt="OLIVER"
                width={32}
                height={32}
                className="flex-shrink-0 hidden dark:block"
              />
              <Image
                src="https://kokonutui.com/logo-black.svg"
                alt="OLIVER"
                width={32}
                height={32}
                className="flex-shrink-0 block dark:hidden"
              />
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">OLIVER</span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  主菜单
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={Home}>
                    首页
                  </NavItem>
                  <NavItem href="/codetop" icon={Code}>
                    题库
                  </NavItem>
                  <NavItem href="/report" icon={Zap}>
                    我要爆料
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  笔记管理
                </div>
                <div className="space-y-1">
                  <NavItem href="/notes/my" icon={StickyNote}>
                    我的笔记
                  </NavItem>
                  <NavItem href="/notes/public" icon={Globe}>
                    社区笔记
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  数据分析
                </div>
                <div className="space-y-1">
                  <NavItem href="/analysis" icon={BarChart3}>
                    分析
                  </NavItem>
                  <NavItem href="/leaderboard" icon={Trophy}>
                    排行榜
                  </NavItem>
                  <NavItem href="/review" icon={RefreshCw}>
                    复习
                  </NavItem>
                  <NavItem href="/completed" icon={CheckCircle}>
                    完成记录
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  AI 推荐
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard/recommendations" icon={Brain}>
                    智能推荐
                  </NavItem>
                  <NavItem href="/dashboard/history" icon={History}>
                    推荐历史
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/dashboard/preferences" icon={Settings}>
                设置
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                帮助
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
