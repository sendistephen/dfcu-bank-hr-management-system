'use client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { registerNewStaffFormSchema } from '@/lib/form-schema';

type FormValues = z.infer<typeof registerNewStaffFormSchema>;

const RegisterNewStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(registerNewStaffFormSchema),
    defaultValues: {
      surname: '',
      otherNames: '',
      uniqueCode: '',
    },
  });

  /**
   * Submits the registration form and creates a new staff member.
   * @param values - The form values
   */
  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    const formData = {
      surname: values.surname,
      otherNames: values.otherNames,
      dateOfBirth: values.dateOfBirth.toISOString().split('T')[0],
      idPhoto: previewUrl || '',
      uniqueCode: values.uniqueCode,
    };
    console.log(formData);
    try {
      // Todo: Implement the registration logic
    } catch (error) {
      setIsLoading(false);

      toast('Registration failed. Please try again later.');
      console.error(error);
    }
  }
  /**
   * Handles changes to the file input element. If a file is selected, it
   * will be read and the base64 encoded data URL will be set as the
   * `previewUrl` state.
   * @param event - The React `ChangeEvent` object
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Resets the `previewUrl` state and clears the value of the file input
   * element.
   */
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-screen-sm mx-auto p-6 border border-gray-200 bg-white rounded">
        <h1 className="text-2xl font-bold mb-1">Staff Registration</h1>
        <small className="text-neutral-400">
          Acculately fill out the form below
        </small>
        <hr className="mb-6" />
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your surname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Names(s) *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your other names" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="h-7 rounded">
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'yyyy-MM-dd')
                            ) : (
                              <span className="text-xs">YYYY-MM-DD</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idPhoto"
                render={() => (
                  <FormItem>
                    <FormLabel>ID Photo (Optional)</FormLabel>
                    <FormControl>
                      <div className="mt-2 w-full sm:w-1/2 flex justify-center rounded-lg border border-dashed border-gray-900/25 p-4">
                        <div className="text-center">
                          {previewUrl ? (
                            <div className="relative inline-block">
                              <Image
                                width={192}
                                height={192}
                                src={previewUrl}
                                alt="ID Preview"
                                className="max-h-48 rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Plus
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">
                                PNG, JPG, GIF up to 1MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a photo of your ID. File size should be less than
                      1MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uniqueCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enter the 10-digit code provided to you.
                    </FormLabel>

                    <FormControl>
                      <Input placeholder="0000000000" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end items-center gap-4">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterNewStaff;
