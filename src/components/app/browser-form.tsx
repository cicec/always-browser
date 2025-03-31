import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect } from 'react';
import { STORAGE_KEY_BROWSER_FORM_VALUES, USER_AGENT_MAP } from '@/constants/constants';
import { createWebview } from '@/utils/webview';

const formSchema = z.object({
  link: z.string().min(2, {
    message: '请输入正确的网页链接',
  }),
  opacity: z.array(z.number()),
  userAgent: z.enum(['desktop', 'mobile']),
});

type FormValues = z.infer<typeof formSchema>;

export function BrowserForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: '',
      opacity: [100],
      userAgent: 'desktop',
    },
  });

  useEffect(() => {
    const formValuesJson = localStorage.getItem(STORAGE_KEY_BROWSER_FORM_VALUES) || '{}';
    const formValues = JSON.parse(formValuesJson) as FormValues;

    if (Object.keys(formValues).length > 0) {
      for (const [key, value] of Object.entries(formValues)) {
        form.setValue(key as keyof FormValues, value);
      }
    }
  }, []);

  const onSubmit = async (values: FormValues) => {
    createWebview({
      label: 'webview',
      link: values.link,
      userAgent: USER_AGENT_MAP[values.userAgent],
    });

    localStorage.setItem(STORAGE_KEY_BROWSER_FORM_VALUES, JSON.stringify(values));
  };

  return (
    <Card className="w-[480px]">
      <CardHeader>
        <CardTitle className="text-2xl">悬浮网页</CardTitle>
        <CardDescription className="text-xs">
          填入访问链接然后使它全局悬浮置顶在任意位置
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="flex justify-between">
                  <FormLabel className="font-bold text-nowrap">访问链接</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://www.example.com/" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Alert>
              <AlertTitle>页面配置</AlertTitle>
              <AlertDescription className="p-4 flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="opacity"
                  render={({ field }) => (
                    <FormItem className="flex justify-between">
                      <FormLabel className="font-bold text-nowrap basis-26">透明度</FormLabel>
                      <FormControl>
                        <Slider
                          value={field.value}
                          max={100}
                          min={0}
                          step={1}
                          onValueChange={field.onChange}
                        />
                      </FormControl>

                      <span className="text-sm basis-20 text-right">{field.value[0]}%</span>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userAgent"
                  render={({ field }) => (
                    <FormItem className="flex justify-between">
                      <FormLabel className="font-bold text-nowrap basis-26">模拟设备</FormLabel>
                      <FormControl className="flex">
                        <RadioGroup
                          className="flex-row align-middle"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="desktop" id="desktop" />
                            <Label htmlFor="desktop">桌面端</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mobile" id="mobile" />
                            <Label htmlFor="mobile">移动端</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button type="submit" className="px-40">
                <Send />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
