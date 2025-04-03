import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "./components/ui/checkbox";
import { ArrowUpDown, Pencil, ShieldCheck, ShieldX, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog";
import { Spinner } from "./components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { Badge } from "./components/ui/badge";
import { ModeToggle } from "./components/ui/mode-toggle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./components/ui/form";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  balance: number;
  email: string;
  registerAt: string;
  active: boolean;
}

export default function TestTwo() {
  const form = useForm<User>({
    defaultValues: {
      id: "",
      name: "",
      balance: 0,
      email: "",
      registerAt: new Date().toISOString(),
      active: false,
    },
  });
  const [users, setUsers] = useState<User[]>([]);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState("");
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const fetchUsers = async () => {
    await axios
      .get("https://67ed44004387d9117bbcfb13.mockapi.io/users")
      .then((res) => {
        setUsers(res.data);
        toast.success("Users fetched successfully");
      })
      .catch(() => {
        setError("Failed to fetch users");
        toast.error("Failed to fetch users");
      });
  };

  const deleteUser = async (id: string) => {
    await axios
      .delete(`https://67ed44004387d9117bbcfb13.mockapi.io/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
      })
      .catch(() => {
        setError("Failed to delete user");
        toast.error("Failed to delete user");
      });
  };

  const updateUser = async (data: Partial<User>) => {
    await axios
      .put(`https://67ed44004387d9117bbcfb13.mockapi.io/users/${data.id}`, data)
      .then(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === data.id ? { ...user, ...data } : user
          )
        );
        toast.success("User updated successfully");
      })
      .catch(() => {
        setError("Failed to update user");
        toast.error("Failed to update user");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "balance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Balance ($)
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">${row.getValue("balance")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <a
          href={`mailto:${row.getValue("email")}`}
          className="border-b-2 hover:border-black dark:hover:border-white"
        >
          {row.getValue("email")}
        </a>
      ),
    },
    {
      accessorKey: "registerAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Registration
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formattedDate = new Date(row.getValue("registerAt"))
          .toISOString()
          .split("T")[0];
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{formattedDate}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {new Date(row.getValue("registerAt")).toLocaleString()}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("active") ? (
            <ShieldCheck fill="green" />
          ) : (
            <ShieldX fill="red" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <EditButton
            row={row}
            form={form}
            func={async (data) => {
              await updateUser(data);
            }}
          />
          <DeleteButton
            row={row}
            table={table}
            func={async (id) => {
              await deleteUser(id);
            }}
          />
        </div>
      ),
    },
  ];
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (limit < users.length) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        console.log("Load more data");
        setPagination((prev) => ({
          ...prev,
          pageSize: prev.pageSize + 20,
        }));
      }
    });

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [limit]);

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex items-center justify-between space-x-2 py-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {limit}/pages
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Rows per page</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={limit.toString()}
              onValueChange={(value) => {
                if (value === "Infinite Scroll") {
                  setIsInfiniteScroll(true);
                  setLimit(users.length);
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: (prev.pageIndex + 1) * 20,
                  }));
                  table.resetRowSelection();
                  return;
                }
                setIsInfiniteScroll(false);
                setLimit(Number(value));
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                }));
                table.resetRowSelection();
              }}
            >
              <DropdownMenuRadioItem value="5">5</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="15">15</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="20">20</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Infinite Scroll">
                <Badge variant="default">Infinite Scroll</Badge>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center gap-3">
                  {error ? (
                    <div className="bg-red-300 p-2 rounded-md text-red-800">
                      {error}
                    </div>
                  ) : (
                    <Spinner className="mx-auto">Loading...</Spinner>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
          {isInfiniteScroll && pagination.pageSize < users.length && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <div ref={observerRef}>Loading more...</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 p-4">
        {table.getFilteredRowModel().rows.length} results
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isInfiniteScroll}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isInfiniteScroll}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

const EditButton = ({
  row,
  form,
  func,
}: {
  row: Row<User>;
  form: ReturnType<typeof useForm<User>>;
  func?: (data: Partial<User>) => Promise<void>;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => {
            form.setValue("name", row.original.name);
            form.setValue("email", row.original.email);
            form.setValue("balance", row.original.balance);
            form.setValue("registerAt", row.original.registerAt.split("T")[0]);
            form.setValue("active", row.original.active);
            form.setValue("id", row.original.id);
          }}
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to user here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(func || (() => Promise.resolve()))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Balance"
                      min={0}
                      step={0.01}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registerAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Register At</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Register At" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteButton = ({
  row,
  table,
  func,
}: {
  row: Row<User>;
  table: TanstackTable<User>;
  func?: (id: string) => Promise<void>;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={!row.getIsSelected()}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete from our
            records.
            <br />
            {row.getIsSelected() && (
              <span className="text-red-500">
                {table.getSelectedRowModel().rows.length} users will be deleted.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const selectedRows = table.getSelectedRowModel().rows;
              if (selectedRows.length === 0) {
                return;
              }
              const selectedRowIds = selectedRows.map((row) => row.original.id);
              selectedRowIds.forEach(async (id) => {
                if (func) {
                  await func(id);
                }
              });
              table.resetRowSelection();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
