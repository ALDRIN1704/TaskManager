import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function DraggableTaskCard({ task, onEdit, onDelete, onViewDetails, isAdmin }) {
  const isSubTask = !!task.parentTaskId;
  const draggableId = isSubTask ? `subtask-${task.id}` : `task-${task.id}`;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`touch-none ${isDragging ? 'opacity-40 shadow-lg scale-95' : ''}`}
    >
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <TaskCard
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

function KanbanColumn({ id, title, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col space-y-4 p-5 rounded-3xl border-2 min-h-[500px] transition-colors ${
        isOver ? 'bg-indigo-50/40 border-indigo-300 border-dashed' : 'bg-slate-50/60 border-slate-100'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</h4>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-650">
          {React.Children.count(children)}
        </span>
      </div>
      <div className="flex-1 space-y-4 mt-2">
        {React.Children.count(children) === 0 ? (
          <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-200/60 rounded-2xl text-slate-400 text-xs font-medium">
            No items here
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, onTaskStatusChange, onEditTask, onDeleteTask, onOpenDetailsTask, isAdmin = false }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const isSubTask = activeId.startsWith('subtask-');
    const cleanActiveId = activeId.replace('subtask-', '').replace('task-', '');

    const draggedTask = tasks.find(t => {
      const matchId = t.id.toString() === cleanActiveId;
      const matchSub = isSubTask ? !!t.parentTaskId : !t.parentTaskId;
      return matchId && matchSub;
    });

    if (!draggedTask) return;

    let targetStatus = null;

    if (['TODO', 'IN_PROGRESS', 'COMPLETED'].includes(overId)) {
      targetStatus = overId;
    } else {
      const targetItem = tasks.find(t => {
        const isTargetSub = !!t.parentTaskId;
        const targetDraggableId = isTargetSub ? `subtask-${t.id}` : `task-${t.id}`;
        return targetDraggableId === overId;
      });
      if (targetItem) {
        targetStatus = targetItem.status;
      }
    }

    if (targetStatus && draggedTask.status !== targetStatus) {
      onTaskStatusChange(cleanActiveId, targetStatus, isSubTask);
    }
  };

  const columns = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'COMPLETED', title: 'Completed' },
  ];

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn key={col.id} id={col.id} title={col.title}>
              {columnTasks.map((task) => {
                const isSub = !!task.parentTaskId;
                const uniqueKey = isSub ? `subtask-${task.id}` : `task-${task.id}`;
                return (
                  <DraggableTaskCard
                    key={uniqueKey}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onViewDetails={onOpenDetailsTask}
                    isAdmin={isAdmin}
                  />
                );
              })}
            </KanbanColumn>
          );
        })}
      </div>
    </DndContext>
  );
}
