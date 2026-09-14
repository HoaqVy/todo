export function isOverdue(task) {
    if (!task.dueDate) return false;

    const today = new Date();
    const dueDate = new Date(task.dueDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return (
        dueDate < today &&
        task.status !== "Completed"
    );
}