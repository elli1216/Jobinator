import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getApplicationList,
  updateApplicationStatus,
  Application,
} from '../features/yourList/server/application.server'
import { Loading } from '@/features/common/components/Loading'
import { useAuth } from '@/hooks/use-auth'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ApplicationStatus } from '@/generated/prisma/enums'
import { useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/board')({
  component: BoardComponent,
})

type ApplicationsByStatus = Record<ApplicationStatus, Application[]>

function JobCard({ application }: { application: Application }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.uuid })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-2 bg-card rounded-lg border shadow-sm"
    >
      <p className="font-semibold">{application.company_name}</p>
      <p className="text-sm text-muted-foreground">{application.job_title}</p>
    </div>
  )
}

function Column({
  status,
  applications,
}: {
  status: ApplicationStatus
  applications: Application[]
}) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className="bg-secondary dark:bg-secondary rounded-lg p-4 w-80 shrink-0"
    >
      <h2 className="text-lg font-bold mb-4 capitalize">
        {status.replace(/_/g, ' ')}
      </h2>
      <SortableContext
        id={status}
        items={applications.map((app) => app.uuid)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {applications.map((app) => (
            <JobCard key={app.uuid} application={app} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function BoardComponent() {
  const { user, isLoaded } = useAuth()
  const queryClient = useQueryClient()

  const { data: applicationList, isLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () =>
      getApplicationList({ data: { clerkId: user!.id } }).then((res) => res || []),
    enabled: !!user?.id,
  })

  const [applicationsByStatus, setApplicationsByStatus] =
    useState<ApplicationsByStatus>({
      To_Apply: [],
      Applied: [],
      Interviewing: [],
      Offered: [],
      Rejected: [],
      Accepted: [],
      No_Response: [],
    })

  const [activeId, setActiveId] = useState<string | null>(null)

  const activeApplication = useMemo(() => {
    if (!activeId || !applicationList) return null
    return applicationList.find((app) => app.uuid === activeId)
  }, [activeId, applicationList])

  useEffect(() => {
    if (applicationList) {
      const grouped = applicationList.reduce(
        (acc, app) => {
          acc[app.status].push(app)
          return acc
        },
        {
          To_Apply: [],
          Applied: [],
          Interviewing: [],
          Offered: [],
          Rejected: [],
          Accepted: [],
          No_Response: [],
        } as ApplicationsByStatus,
      )
      setApplicationsByStatus(grouped)
    }
  }, [applicationList])

  const { mutate } = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', user?.id] })
      toast.success('Application status updated successfully!')
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`)
    },
  })

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const activeContainer = active.data.current?.sortable.containerId
    const overContainer = over.data.current?.sortable.containerId || over.id

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      // Reordering logic
      if (
        activeContainer &&
        overContainer &&
        activeContainer === overContainer
      ) {
        setApplicationsByStatus((prev) => {
          const items = prev[activeContainer as ApplicationStatus]
          const oldIndex = items.findIndex((item) => item.uuid === activeId)
          const newIndex = items.findIndex((item) => item.uuid === overId)
          if (oldIndex === -1 || newIndex === -1) return prev
          return {
            ...prev,
            [activeContainer]: arrayMove(items, oldIndex, newIndex),
          }
        })
      }
      return
    }

    setApplicationsByStatus((prev) => {
      const activeItems = prev[activeContainer as ApplicationStatus]
      const overItems = prev[overContainer as ApplicationStatus]
      const activeIndex = activeItems.findIndex(
        (item) => item.uuid === activeId,
      )

      if (activeIndex === -1) {
        return prev
      }

      const overIndex = overItems.findIndex((item) => item.uuid === overId)

      const newOverItems = [...overItems]
      const [movedItem] = activeItems.splice(activeIndex, 1)
      newOverItems.splice(
        overIndex >= 0 ? overIndex : newOverItems.length,
        0,
        movedItem,
      )

      return {
        ...prev,
        [activeContainer]: [...activeItems],
        [overContainer]: newOverItems,
      }
    })

    mutate({
      data: {
        applicationId: activeId,
        status: overContainer as ApplicationStatus,
      },
    })
  }

  if (!isLoaded || isLoading) return <Loading />

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="grid grid-cols-1 p-4 h-full">
        <div className="flex grow w-full gap-4 pb-2 overflow-x-auto">
          {Object.entries(applicationsByStatus).map(([status, apps]) => (
            <Column
              key={status}
              status={status as ApplicationStatus}
              applications={apps}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeId && activeApplication ? (
          <JobCard application={activeApplication} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
