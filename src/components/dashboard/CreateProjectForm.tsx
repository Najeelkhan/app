import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  drawingCount: z.string().transform(Number).pipe(z.number().min(1)),
  startDate: z.string(),
  elements: z.object({
    columns: z.number().min(0),
    walls: z.number().min(0),
    beams: z.number().min(0),
    roofSlabs: z.number().min(0),
    parapet: z.number().min(0),
    staircaseWalls: z.number().min(0),
    staircaseFlights: z.number().min(0),
    floors: z.number().min(0),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FormValues) => void;
}

const structuralElements = [
  { name: "columns", label: "Columns" },
  { name: "walls", label: "Walls" },
  { name: "beams", label: "Beams" },
  { name: "roofSlabs", label: "Roof Slabs" },
  { name: "parapet", label: "Parapet" },
  { name: "staircaseWalls", label: "Staircase Walls" },
  { name: "staircaseFlights", label: "Staircase Flights" },
];

const CreateProjectForm = ({
  open = true,
  onClose = () => {},
  onSubmit = (data) => console.log(data),
}: CreateProjectFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      clientName: "",
      drawingCount: "1",
      startDate: new Date().toISOString().split("T")[0],
      elements: {
        columns: 0,
        walls: 0,
        beams: 0,
        roofSlabs: 0,
        parapet: 0,
        staircaseWalls: 0,
        staircaseFlights: 0,
        floors: 0,
      },
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Calculate total elements
    const totalElements = Object.entries(values.elements).reduce(
      (sum, [key, count]) => (key === "floors" ? sum : sum + count),
      0,
    );

    // Check if total elements matches drawing count
    if (totalElements !== Number(values.drawingCount)) {
      form.setError("drawingCount", {
        type: "manual",
        message: `Total shop drawings (${totalElements}) must match the number of drawings (${values.drawingCount})`,
      });
      return;
    }
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the project details to create a new construction drawing
            tracking project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="elements">Shop Drawing</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter project description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter client name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drawingCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Drawings</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Enter number of drawings"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="elements" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="elements.floors"
                    render={({ field }) => (
                      <FormItem>
                        <Card>
                          <CardContent className="p-4">
                            <FormLabel>Number of Floors</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Enter number of floors"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </CardContent>
                        </Card>
                      </FormItem>
                    )}
                  />
                  {structuralElements.map((element) => (
                    <FormField
                      key={element.name}
                      control={form.control}
                      name={`elements.${element.name}`}
                      render={({ field }) => (
                        <FormItem>
                          <Card>
                            <CardContent className="p-4">
                              <FormLabel>{element.label}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder={`Enter number of ${element.label.toLowerCase()}`}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </CardContent>
                          </Card>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectForm;
