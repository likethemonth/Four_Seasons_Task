import { NextResponse } from 'next/server';
import { housekeepingStore } from '@/lib/store/housekeeping';
import { startTask, completeTask } from '@/lib/housekeeping/queue';

interface RouteParams {
  params: Promise<{ taskId: string }>;
}

/**
 * GET /api/housekeeping/task/[taskId]
 * Get a specific task by ID.
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { taskId } = await params;
  const task = housekeepingStore.get(taskId);

  if (!task) {
    return NextResponse.json(
      { success: false, error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: task,
  });
}

/**
 * PATCH /api/housekeeping/task/[taskId]
 * Update task status.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    let task;
    switch (status) {
      case 'in_progress':
        task = startTask(taskId);
        break;
      case 'complete':
        task = completeTask(taskId);
        break;
      default:
        task = housekeepingStore.updateStatus(taskId, status);
    }

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
