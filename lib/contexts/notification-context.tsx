"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { NotificationService } from '../services/notification-service'
import { useAuth } from './auth-context'
import type { Notification } from '../types/blog-management'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Toast functions using Sonner
  const success = (message: string, description?: string) => {
    toast.success(message, { description })
  }

  const error = (message: string, description?: string) => {
    toast.error(message, { description })
  }

  const info = (message: string, description?: string) => {
    toast.info(message, { description })
  }

  const warning = (message: string, description?: string) => {
    toast.warning(message, { description })
  }

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const [notificationsData, unreadCountData] = await Promise.all([
        NotificationService.getUserNotifications(user.id),
        NotificationService.getUnreadCount(user.id)
      ])
      
      setNotifications(notificationsData)
      setUnreadCount(unreadCountData)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    if (!user) return

    try {
      await NotificationService.markAsRead(notificationId, user.id)
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      await NotificationService.markAllAsRead(user.id)
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const refreshNotifications = async () => {
    await fetchNotifications()
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()

      // Subscribe to real-time notifications
      const subscription = NotificationService.subscribeToNotifications(
        user.id,
        (newNotification) => {
          setNotifications(prev => [newNotification, ...prev])
          if (!newNotification.is_read) {
            setUnreadCount(prev => prev + 1)
          }
        }
      )

      return () => {
        NotificationService.unsubscribeFromNotifications(subscription)
      }
    }
  }, [user])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    success,
    error,
    info,
    warning
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

