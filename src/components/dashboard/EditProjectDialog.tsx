import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  elements: z.array(
    z.object({
      type: z.string(),
      completed: z.number().min(0),
      total: z.number().min(0),
      status: z.enum(["A", "B", "C"]),
      floorElements: z
        .record(
          z.string(),
          z.object({
            completed: z.number().min(0),
            total: z.number().min(0),
            status: z.enum(["A", "B", "C"]),
          }),
        )
        .optional(),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProjectDialogProps {
  open: boolean;
  project: Project;
  onClose: () => void;
  onSave: (projectId: string, data: FormValues) => void;
}

const EditProjectDialog = ({
  open,
  project,
  onClose,
  onSave,
}: EditProjectDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      elements: project.elements.map((elem) => ({
        type: elem.type,
        completed: elem.completed,
        total: elem.total,
        status: elem.status,
        floorDetails: elem.floorDetails || [],
      })),
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSave(project.id, values);
    onClose();
  };

  const numFloors =
    project.elements.find((e) => e.type === "floors")?.total || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Edit Project - {project.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel>Submitted Drawings</FormLabel>
                <div className="text-2xl font-semibold mt-2">
                  {form
                    .watch("elements")
                    .reduce((sum, elem) => sum + (elem.completed || 0), 0)}
                </div>
              </div>
              <div>
                <FormLabel>Status</FormLabel>
                <div className="text-2xl font-semibold mt-2">
                  {(() => {
                    const statuses = form
                      .watch("elements")
                      .map((e) => e.status);
                    if (statuses.every((s) => s === "A")) return "Approved";
                    if (statuses.every((s) => s === "C")) return "Pending";
                    if (
                      statuses.some((s) => s === "A") ||
                      statuses.some((s) => s === "B")
                    )
                      return "In Review";
                    return "Pending";
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shop Drawing Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.elements.map((element, index) => (
                  <Card key={element.type}>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <FormLabel className="capitalize">
                          {element.type.replace(/([A-Z])/g, " $1").trim()}
                        </FormLabel>
                        <FormField
                          control={form.control}
                          name={`elements.${index}.completed`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  max={form.watch(`elements.${index}.total`)}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">
                            Total:
                          </div>
                          <FormField
                            control={form.control}
                            name={`elements.${index}.total`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    className="w-20 h-7 text-sm"
                                    {...field}
                                    onChange={(e) => {
                                      const newTotal = Number(e.target.value);
                                      field.onChange(newTotal);
                                      const completed = form.watch(
                                        `elements.${index}.completed`,
                                      );
                                      if (completed > newTotal) {
                                        form.setValue(
                                          `elements.${index}.completed`,
                                          newTotal,
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`elements.${index}.status`}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[110px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">Approved</SelectItem>
                                <SelectItem value="B">In Review</SelectItem>
                                <SelectItem value="C">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Floor Details</h3>
              <Tabs defaultValue="floor1" className="w-full">
                <TabsList className="grid grid-cols-10 w-full">
                  {Array.from({ length: numFloors }).map((_, i) => (
                    <TabsTrigger
                      key={i}
                      value={`floor${i + 1}`}
                      className="text-sm"
                    >
                      {i + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Array.from({ length: numFloors }).map((_, floorIndex) => (
                  <TabsContent
                    key={floorIndex}
                    value={`floor${floorIndex + 1}`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "columns",
                        "walls",
                        "beams",
                        "roofSlabs",
                        "parapet",
                        "staircaseWalls",
                      ].map((type) => (
                        <Card key={type}>
                          <CardContent className="p-4 space-y-4">
                            <div>
                              <FormLabel className="capitalize">
                                {type.replace(/([A-Z])/g, " $1").trim()}
                              </FormLabel>
                              <FormField
                                control={form.control}
                                name={`elements.${project.elements.findIndex((e) => e.type === type)}.floorElements.${floorIndex}.completed`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={0}
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="text-sm text-muted-foreground">
                                  Total:
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`elements.${project.elements.findIndex((e) => e.type === type)}.floorElements.${floorIndex}.total`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min={0}
                                          className="w-20 h-7 text-sm"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value),
                                            )
                                          }
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={form.control}
                                name={`elements.${project.elements.findIndex((e) => e.type === type)}.floorElements.${floorIndex}.status`}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-[110px]">
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="A">
                                        Approved
                                      </SelectItem>
                                      <SelectItem value="B">
                                        In Review
                                      </SelectItem>
                                      <SelectItem value="C">Pending</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
