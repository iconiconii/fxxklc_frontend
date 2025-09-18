"use client"

import { useState, useEffect, useCallback } from "react"
import { ExternalLink, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AIBadge from "@/components/recommendation/AIBadge"
import { codeTopApi, type ProblemRankingDTO, type OliverFilterResponse } from "@/lib/codetop-api"
import { useAuth } from "@/lib/auth-context"
import { useRecommendationsPrefetch } from "@/hooks/useRecommendationsPrefetch"

interface DisplayProblem extends Omit<ProblemRankingDTO, 'difficulty'> {
  difficulty: "easy" | "medium" | "hard"
  mastery: number
  status: "not_done" | "done" | "reviewed" | "attempted"
}

const difficultyColors = {
  easy: "bg-green-500 text-white",
  medium: "bg-orange-500 text-white", 
  hard: "bg-red-500 text-white",
}

const difficultyLabels = {
  easy: "容易",
  medium: "中等",
  hard: "困难",
}

export default function ProblemList() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [problems, setProblems] = useState<DisplayProblem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Prefetch recommendations for badge display
  useRecommendationsPrefetch({ 
    enabled: isAuthenticated && !authLoading,
    limit: 15 // Prefetch a few more than visible to ensure good coverage
  })
  
  const [pagination, setPagination] = useState({
    current: 1,
    size: 15,
    total: 0,
    pages: 0,
  })

  // Transform API ProblemRankingDTO to DisplayProblem
  const transformProblem = useCallback((apiProblem: ProblemRankingDTO): DisplayProblem => {
    return {
      ...apiProblem,
      difficulty: apiProblem.difficulty.toLowerCase() as "easy" | "medium" | "hard",
      mastery: 0,
      status: "not_done",
    }
  }, [])

  // Fetch problems data
  const fetchProblems = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      // 获取全局高频题目
      const response: OliverFilterResponse = await codeTopApi.getGlobalProblems(
        page,
        pagination.size,
        'frequency_score',
        'desc'
      )
      
      // 首页不需要用户状态，直接使用默认状态
      const displayProblems: DisplayProblem[] = response.problems.map(transformProblem)
      
      setProblems(displayProblems)
      setPagination({
        current: response.currentPage,
        size: response.pageSize,
        total: response.totalElements,
        pages: response.totalPages,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '加载题目失败')
      setProblems([])
    } finally {
      setLoading(false)
    }
  }, [pagination.size, transformProblem])

  // 初始加载
  useEffect(() => {
    if (!authLoading) {
      fetchProblems(1)
    }
  }, [fetchProblems, authLoading])

  const handlePageChange = (page: number) => {
    fetchProblems(page)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <Button onClick={() => fetchProblems()} variant="outline" size="sm">
            重试
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-5 border border-gray-200/40 dark:border-gray-700/40 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">算法题库</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              精选 {pagination.total} 道高频面试题
            </p>
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            按频度排序
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="space-y-4">
        {problems.length === 0 ? (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200/30 dark:border-gray-700/30 shadow-sm text-center">
            <div className="text-gray-500 dark:text-gray-400">暂无题目数据</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {problems.map((problem, index) => (
              <div
                key={problem.problemId}
                className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* 排名指示器 */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      index < 3 
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        : index < 10
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* 题目信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <a
                        href={problem.problemUrl || `https://leetcode.cn/problems/problem-${problem.problemId}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {problem.problemId}. {problem.title}
                      </a>
                      <AIBadge problemId={problem.problemId} size="sm" />
                      <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${difficultyColors[problem.difficulty]} border-0 text-xs px-2 py-0.5 rounded`}>
                        {difficultyLabels[problem.difficulty]}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>热度</span>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {problem.frequencyScore}
                        </span>
                      </div>

                      {isAuthenticated && problem.mastery > 0 && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= problem.mastery
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              第 {pagination.current} 页，共 {pagination.pages} 页（总计 {pagination.total} 道题目）
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current <= 1}
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-xs border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                首页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current <= 1}
                onClick={() => handlePageChange(pagination.current - 1)}
                className="px-3 py-1 text-xs border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                上一页
              </Button>
              
              {/* 页码显示 */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.current <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.current >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.current - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.current ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 p-0 text-xs ${
                        pageNum === pagination.current 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                      } transition-colors`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current >= pagination.pages}
                onClick={() => handlePageChange(pagination.current + 1)}
                className="px-3 py-1 text-xs border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                下一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current >= pagination.pages}
                onClick={() => handlePageChange(pagination.pages)}
                className="px-3 py-1 text-xs border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                末页
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}