import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskColumn } from './TaskColumn';
import { TaskDialog } from './TaskDialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Task, getTasks, updateTaskStatus } from '@/api/tasks';

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { tasks } = await getTasks();
      setTasks(tasks);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag end event:', {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data,
      overData: over?.data
    });

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    const currentTask = tasks.find(task => task._id === taskId);
    console.log('Current task:', currentTask);

    if (currentTask && currentTask.status !== newStatus) {
      try {
        console.log(`Updating task ${taskId} from ${currentTask.status} to ${newStatus}`);
        await updateTaskStatus(taskId, newStatus);
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        ));
      } catch (error) {
        console.error('Error in handleDragEnd:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        });
      }
    }
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Task Board</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn
            title="Pending"
            tasks={tasks.filter(task => task.status === 'Pending')}
            status="Pending"
            onTaskDelete={(taskId) => {
              setTasks(tasks.filter(task => task._id !== taskId));
            }}
          />
          <TaskColumn
            title="Completed"
            tasks={tasks.filter(task => task.status === 'Completed')}
            status="Completed"
            onTaskDelete={(taskId) => {
              setTasks(tasks.filter(task => task._id !== taskId));
            }}
          />
          <TaskColumn
            title="Done"
            tasks={tasks.filter(task => task.status === 'Done')}
            status="Done"
            onTaskDelete={(taskId) => {
              setTasks(tasks.filter(task => task._id !== taskId));
            }}
          />
        </div>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={(task) => {
          addTask(task);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}