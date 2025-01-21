import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '@/api/tasks';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskDelete?: (taskId: string) => void;
}

export function TaskColumn({ title, tasks, status, onTaskDelete }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-card/50 backdrop-blur-sm p-4 rounded-lg border min-h-[500px]"
    >
      <h3 className="font-semibold mb-4">{title}</h3>
      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onDelete={() => onTaskDelete?.(task._id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}