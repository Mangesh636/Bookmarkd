import { useEffect, useState } from "react";
import { auth } from "@/features/auth/auth";
import {
	createTodo,
	deleteTodo,
	listTodos,
	updateTodo,
} from "@/features/todos/todos.functions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "@/shared/components/ui/toast";

type Todo = {
	$id: string;
	$createdAt: string;
	title: string;
	description: string;
	isComplete: boolean;
	ownerId: string;
};
const errorText = (e: unknown) =>
	e instanceof Error ? e.message : "Something went wrong. Please try again.";

export function TodoDashboard() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [editing, setEditing] = useState<Todo | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [workingId, setWorkingId] = useState("");
	const [error, setError] = useState("");

	async function refresh() {
		setLoading(true);
		setError("");
		try {
			setTodos(await listTodos({ data: { jwt: await auth.createJWT() } }));
		} catch (e) {
			setError(errorText(e));
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		void refresh();
	}, []);

	async function add(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!title.trim()) return;
		setBusy(true);
		setError("");
		try {
			const task = await createTodo({
				data: {
					jwt: await auth.createJWT(),
					title: title.trim(),
					description: description.trim(),
				},
			});
			setTodos((items) => [task, ...items]);
			setTitle("");
			setDescription("");
			toast.add({ type: "success", description: "Task created." });
		} catch (e) {
			setError(errorText(e));
		} finally {
			setBusy(false);
		}
	}

	async function save(task: Todo, complete = task.isComplete) {
		setWorkingId(task.$id);
		setError("");
		try {
			const updated = await updateTodo({
				data: {
					jwt: await auth.createJWT(),
					taskId: task.$id,
					title: editing?.$id === task.$id ? editTitle.trim() : task.title,
					description:
						editing?.$id === task.$id
							? editDescription.trim()
							: task.description || "",
					isComplete: complete,
				},
			});
			setTodos((items) =>
				items.map((item) => (item.$id === task.$id ? updated : item)),
			);
			setEditing(null);
			toast.add({ type: "success", description: "Task updated." });
		} catch (e) {
			setError(errorText(e));
		} finally {
			setWorkingId("");
		}
	}

	async function remove(task: Todo) {
		setWorkingId(task.$id);
		setError("");
		try {
			await deleteTodo({
				data: { jwt: await auth.createJWT(), taskId: task.$id },
			});
			setTodos((items) => items.filter((item) => item.$id !== task.$id));
			if (editing?.$id === task.$id) setEditing(null);
			toast.add({ type: "success", description: "Task deleted." });
		} catch (e) {
			setError(errorText(e));
		} finally {
			setWorkingId("");
		}
	}

	const completed = todos.filter((task) => task.isComplete).length;
	return (
		<div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
			<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm text-muted-foreground">
						A small Appwrite experiment
					</p>
					<h1 className="mt-2 font-display text-3xl font-semibold">
						Your tasks
					</h1>
					<p className="mt-2 text-muted-foreground">
						Create, organize, and finish your tasks.
					</p>
				</div>
				<div className="rounded-2xl border bg-card px-4 py-3 text-sm">
					<strong>{todos.length}</strong>
					<span className="text-muted-foreground"> tasks · </span>
					<strong>{completed}</strong>
					<span className="text-muted-foreground"> completed</span>
				</div>
			</div>
			<form
				onSubmit={(e) => void add(e)}
				className="rounded-3xl border bg-card p-5 shadow-sm"
			>
				<h2 className="font-display text-lg font-semibold">Add a task</h2>
				<div className="mt-4 grid gap-3">
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="What needs to get done?"
						aria-label="Task title"
						maxLength={160}
						required
					/>
					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Add a note (optional)"
						aria-label="Task description"
						maxLength={2000}
						rows={2}
					/>
					<div className="flex justify-end">
						<Button type="submit" disabled={busy || !title.trim()}>
							{busy ? "Adding..." : "Add task"}
						</Button>
					</div>
				</div>
			</form>
			{error && (
				<p
					role="alert"
					className="mt-4 rounded-xl border border-destructive/30 p-3 text-sm text-destructive"
				>
					{error}
				</p>
			)}
			<div className="mb-3 mt-8 flex items-center justify-between">
				<h2 className="font-display text-xl font-semibold">All tasks</h2>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => void refresh()}
					disabled={loading}
				>
					{loading ? "Loading..." : "Refresh"}
				</Button>
			</div>
			{loading && !todos.length ? (
				<p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
					Loading tasks...
				</p>
			) : !todos.length ? (
				<p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
					Nothing here yet. Add your first task above.
				</p>
			) : (
				<ul className="space-y-3">
					{todos.map((task) => (
						<li key={task.$id} className="rounded-2xl border bg-card p-4">
							{editing?.$id === task.$id ? (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										void save(task);
									}}
									className="grid gap-3"
								>
									<Input
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
										required
										maxLength={160}
										aria-label="Edit title"
									/>
									<Textarea
										value={editDescription}
										onChange={(e) => setEditDescription(e.target.value)}
										maxLength={2000}
										rows={2}
										aria-label="Edit description"
									/>
									<div className="flex justify-end gap-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setEditing(null)}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											disabled={!!workingId || !editTitle.trim()}
										>
											Save
										</Button>
									</div>
								</form>
							) : (
								<div className="flex items-start gap-3">
									<input
										type="checkbox"
										checked={task.isComplete}
										disabled={!!workingId}
										onChange={(e) => void save(task, e.target.checked)}
										aria-label="Toggle completion"
										className="mt-1 size-4 accent-primary"
									/>
									<div className="min-w-0 flex-1">
										<p
											className={
												task.isComplete
													? "break-words font-medium line-through text-muted-foreground"
													: "break-words font-medium"
											}
										>
											{task.title}
										</p>
										{task.description && (
											<p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
												{task.description}
											</p>
										)}
									</div>
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="sm"
											disabled={!!workingId}
											onClick={() => {
												setEditing(task);
												setEditTitle(task.title);
												setEditDescription(task.description || "");
											}}
										>
											Edit
										</Button>
										<Button
											variant="ghost"
											size="sm"
											disabled={!!workingId}
											onClick={() => void remove(task)}
										>
											Delete
										</Button>
									</div>
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
