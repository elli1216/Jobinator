import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import type { RecentActivity } from '@/features/yourList/server/application.server'

export function RecentActivityList({ activity }: { activity: RecentActivity }) {
  if (activity.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No recent activity to display.</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activity.map((app) => (
            <div key={app.uuid} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {app.company_name} - {app.job_title}
                </p>
                <p className="text-sm text-muted-foreground">{app.status}</p>
              </div>
              <div className="ml-auto font-medium">
                {new Date(
                  app.updatedAt ?? app.createdAt,
                ).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
