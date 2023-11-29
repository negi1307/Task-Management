import { v4 as uuidv4 } from 'uuid';
export const data = [
  {
    id: '1',
    task_name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.',
    // Assigned_To: 'Beltran',
    // Assignee: 'Romona',
    // Status: 'To-do',
    // Priority: 'Low',
    due_date: '25-May-2020',
  },
  {
    id: '2',
    task_name: 'Fix Styling',
    // Assigned_To: 'Dave',
    // Assignee: 'Romona',
    // Status: 'To-do',
    // Priority: 'Low',
    due_date: '26-May-2020',
  },
  {
    id: '3',
    task_name: 'Handle Door Specs',
    // Assigned_To: 'Roman',
    // Assignee: 'Romona',
    // Status: 'To-do',
    // Priority: 'Low',
    due_date: '27-May-2020',
  },
  {
    id: '4',
    task_name: 'morbi',
    // Assigned_To: 'Gawen',
    // Assignee: 'Kai',
    // Status: 'Done',
    // Priority: 'High',
    due_date: '23-Aug-2020',
  },
  {
    id: '5',
    task_name: 'proin',
    // Assigned_To: 'Bondon',
    // Assignee: 'Antoinette',
    // Status: 'In Progress',
    // Priority: 'Medium',
    due_date: '05-Jan-2021',
  },
 
];

export const columnsFromBackend = {
  [uuidv4()]: {
    title: 'To-do',
    items: data,
  },
  [uuidv4()]: {
    title: 'In Progress',
    items: [],
  },
  [uuidv4()]: {
    title: 'Hold',
    items: [],
  },
  [uuidv4()]: {
    title: 'Done',
    items: [],
  },
};
