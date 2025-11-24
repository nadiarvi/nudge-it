export type TaskStatus = 'To Do' | 'In Review' | 'Revise' | 'Done';

export interface Task {
  id?: string;
  title: string;
  deadline: Date;
  assignedTo: string;
  status: TaskStatus;
  reviewer?: string | null;
  nudgeCount?: number;
}

export interface TaskCardProps extends Task {
  onStatusChange?: (status: TaskStatus) => void;
}

export interface TaskDetailParams {
  id?: string;
  title: string;
  deadline: string;
  assignedTo: string;
  status: TaskStatus;
  reviewer?: string | null;
  nudgeCount?: number;
}