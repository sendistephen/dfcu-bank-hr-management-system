'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { registerNewStaffFormSchema } from '@/lib/form-schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import SuccessModal from '@/components/success-modal';
import { useEmployeeStore } from '@/lib/store';
import { useSession } from 'next-auth/react';

type FormValues = z.infer<typeof registerNewStaffFormSchema>;

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const StaffForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegisterSuccess | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const { selectedEmployee, clearSelectedEmployee } = useEmployeeStore();
  const isEditMode = Boolean(employeeId);

  const session = useSession();
  const accessToken = session.data?.accessToken;

  const form = useForm<FormValues>({
    resolver: zodResolver(
      isEditMode
        ? registerNewStaffFormSchema.omit({
            surname: true,
            otherNames: true,
            uniqueCode: true,
          })
        : registerNewStaffFormSchema
    ),
    defaultValues: {
      surname: '',
      otherNames: '',
      uniqueCode: '',
      dateOfBirth: undefined,
    },
  });

  useEffect(() => {
    if (isEditMode && selectedEmployee) {
      form.setValue('surname', selectedEmployee.surname);
      form.setValue('otherNames', selectedEmployee.otherNames);
      form.setValue('dateOfBirth', new Date(selectedEmployee.dateOfBirth));
      setPreviewUrl(selectedEmployee.photoId || null);
    }
  }, [isEditMode, selectedEmployee, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('Photo must not exceed 1MB.');
        setPreviewUrl(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);

    const dateOfBirthISO = values.dateOfBirth.toISOString().split('T')[0];
    const payload = {
      dateOfBirth: dateOfBirthISO,
      photoId: previewUrl ? previewUrl : null,
    };
    startTransition(async () => {
      try {
        if (isEditMode) {
          const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/staff/update/${employeeId}`,
            payload,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (res.data.message) {
            toast('Sucess! ', {
              description: `Dear ${res.data.staff.surname}, your details have been updated successfully.`,
            });
          }
          setTimeout(() => {
            clearSelectedEmployee();
            router.back();
          }, 2000);
        } else {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/staff/register`,
            {
              ...payload,
              surname: values.surname,
              otherNames: values.otherNames,
              code: values.uniqueCode,
            },
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          );

          const data = response.data;

          if (data.success) {
            setSuccessData(data);
            form.reset();
            handleRemoveImage();
          } else {
            setError(data.error);
          }
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message || 'Something went wrong.');
        }
      }
    });
  };

  const handleModalClose = () => {
    setSuccessData(null);
    router.push('/staff');
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-screen-sm mx-auto p-6 border border-gray-200 bg-white rounded">
        <h1 className="text-2xl font-bold mb-1">
          {isEditMode ? 'Edit Employee' : 'Register New Staff'}
        </h1>
        <small className="text-neutral-400">
          Acculately fill out the form below
        </small>
        <hr className="mb-6" />
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isPending} className="space-y-4">
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your surname"
                          {...field}
                          disabled={isEditMode}
                        />
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
                        <Input
                          placeholder="Enter your other names"
                          {...field}
                          disabled={isEditMode}
                        />
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
                          <FormControl className="h-9 rounded">
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
                {/* Hide the unique code field in edit mode */}
                {!isEditMode && (
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
                )}

                {error && (
                  <Label className="text-rose-500 text-xs flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span>{error}</span>
                  </Label>
                )}

                <div className="flex justify-end items-center gap-4">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="w-full md:w-auto">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : isEditMode ? (
                      'Update'
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
              </fieldset>
            </form>
          </Form>
        </div>
      </div>

      {/* show modal on sucessfull creation */}
      {successData && successData.success && (
        <SuccessModal data={successData} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default StaffForm;
