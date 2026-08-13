import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Loader2,
  Save,
  Server,
  Database,
  Cloud,
  HardDrive,
  Key,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import {
  useStorageSettings,
  useUpdateStorageSettings,
  useTestStorageGateway,
  useSwitchStorageProvider,
} from '../../hooks/system-settings.hooks'

export const StorageSettingsPage = () => {
  const { toast } = useToast()

  // Queries
  const { data: storageData, isLoading } = useStorageSettings()

  // Mutations
  const { mutateAsync: updateStorage, isPending: isUpdating } = useUpdateStorageSettings()
  const { mutateAsync: switchProvider, isPending: isSwitching } = useSwitchStorageProvider()
  const { mutateAsync: testStorage, isPending: isTesting } = useTestStorageGateway()

  // Local State
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [prevData, setPrevData] = useState<any>(null)

  // Sync state
  if (storageData !== prevData) {
    setPrevData(storageData)
    if (storageData?.data) {
      const initial: Record<string, any> = {}
      storageData.data.forEach((s: any) => (initial[s.key] = s.value))
      setFormData(initial)
    }
  }

  const handleChange = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const activeProvider = formData.STORAGE_PROVIDER || 'LOCAL'

  const handleProviderSwitch = async (provider: string) => {
    try {
      await switchProvider(provider)
      handleChange('STORAGE_PROVIDER', provider)
      toast({
        title: 'Provider Switched',
        description: `Active storage provider is now ${provider}.`,
      })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to switch provider.', variant: 'destructive' })
    }
  }

  const handleSave = async () => {
    try {
      await updateStorage(formData)
      toast({ title: 'Success', description: 'Storage Settings updated successfully.' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update Storage settings.',
        variant: 'destructive',
      })
    }
  }

  const handleTest = async () => {
    try {
      await testStorage()
      toast({
        title: 'Success',
        description: 'Test file uploaded successfully! Provider is working.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to upload test file.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-foreground'>
            Storage & File Management
          </h2>
          <p className='text-muted-foreground mt-1 text-lg'>
            Configure where system files, assets, and uploads are stored.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='md:col-span-1 border-border shadow-sm'>
          <CardHeader className='bg-muted/50 rounded-t-lg border-b border-border'>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <Database className='h-5 w-5' /> Active Provider
            </CardTitle>
            <CardDescription>Select the active storage engine.</CardDescription>
          </CardHeader>
          <CardContent className='p-6 space-y-6'>
            <div className='space-y-2'>
              <Label>Provider</Label>
              <Select value={activeProvider} onValueChange={handleProviderSwitch}>
                <SelectTrigger className='h-11 border-primary/20 focus:ring-primary/20'>
                  <SelectValue placeholder='Select Provider' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='LOCAL'>Local Server Storage</SelectItem>
                  <SelectItem value='AWS_S3'>Amazon S3</SelectItem>
                  <SelectItem value='AZURE_BLOB'>Azure Blob Storage</SelectItem>
                  <SelectItem value='CLOUDINARY'>Cloudinary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='rounded-lg bg-muted/50 p-4 border border-border'>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-primary mt-0.5' />
                <div>
                  <h4 className='font-medium text-foreground'>System Ready</h4>
                  <p className='text-sm text-muted-foreground mt-1'>
                    The {activeProvider} engine is currently handling all new file uploads across
                    the system dynamically.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className='w-full h-11 gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
              onClick={handleTest}
              disabled={isTesting || isSwitching}
            >
              {isTesting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Cloud className='h-4 w-4' />
              )}
              Test Upload Connection
            </Button>
          </CardContent>
        </Card>

        <Card className='md:col-span-2 border-border shadow-sm'>
          <CardHeader className='bg-muted/50 rounded-t-lg border-b border-border'>
            <CardTitle className='text-xl'>Provider Configuration</CardTitle>
            <CardDescription>
              Configure credentials and settings for the active provider.
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <Tabs value={activeProvider} className='w-full'>
              <div className='border-b border-border px-6 py-4'>
                <TabsList className='bg-muted border border-border shadow-sm p-1 gap-1 h-auto flex-wrap'>
                  <TabsTrigger
                    value='LOCAL'
                    className='data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4'
                  >
                    Local Storage
                  </TabsTrigger>
                  <TabsTrigger
                    value='AWS_S3'
                    className='data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4'
                  >
                    Amazon S3
                  </TabsTrigger>
                  <TabsTrigger
                    value='AZURE_BLOB'
                    className='data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4'
                  >
                    Azure Blob
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* LOCAL STORAGE */}
              <TabsContent value='LOCAL' className='p-6 m-0 animate-in fade-in duration-300'>
                <div className='space-y-6 max-w-xl'>
                  <div className='rounded-lg bg-muted/50 p-4 border border-border flex gap-3'>
                    <HardDrive className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <h4 className='font-medium text-foreground'>Local Directory</h4>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Files will be stored directly on the server&apos;s file system in the
                        configured path. Ensure the application has write permissions to this
                        directory.
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='DEFAULT_STORAGE_PATH'>Storage Directory Path</Label>
                    <div className='relative'>
                      <HardDrive className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='DEFAULT_STORAGE_PATH'
                        placeholder='/var/www/uploads'
                        className='pl-9 h-11'
                        value={formData.DEFAULT_STORAGE_PATH || ''}
                        onChange={(e) => handleChange('DEFAULT_STORAGE_PATH', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='FILE_MAX_SIZE_MB'>Maximum File Size (MB)</Label>
                    <Input
                      id='FILE_MAX_SIZE_MB'
                      type='number'
                      placeholder='10'
                      className='h-11'
                      value={formData.FILE_MAX_SIZE_MB || ''}
                      onChange={(e) => handleChange('FILE_MAX_SIZE_MB', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* AWS S3 */}
              <TabsContent value='AWS_S3' className='p-6 m-0 animate-in fade-in duration-300'>
                <div className='space-y-6 max-w-xl'>
                  <div className='rounded-lg bg-muted/50 p-4 border border-border flex gap-3'>
                    <Cloud className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <h4 className='font-medium text-foreground'>S3 Bucket Configuration</h4>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Files will be uploaded directly to Amazon S3. Pre-signed URLs will be
                        generated for secure access.
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2 col-span-2'>
                      <Label htmlFor='AWS_S3_BUCKET_NAME'>Bucket Name</Label>
                      <Input
                        id='AWS_S3_BUCKET_NAME'
                        placeholder='my-app-uploads-bucket'
                        className='h-11'
                        value={formData.AWS_S3_BUCKET_NAME || ''}
                        onChange={(e) => handleChange('AWS_S3_BUCKET_NAME', e.target.value)}
                      />
                    </div>

                    <div className='space-y-2 col-span-2 md:col-span-1'>
                      <Label htmlFor='AWS_S3_REGION'>Region</Label>
                      <Input
                        id='AWS_S3_REGION'
                        placeholder='us-east-1'
                        className='h-11'
                        value={formData.AWS_S3_REGION || ''}
                        onChange={(e) => handleChange('AWS_S3_REGION', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='space-y-4 pt-4 border-t border-border'>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Authentication Credentials
                    </h3>

                    <div className='space-y-2'>
                      <Label htmlFor='AWS_S3_ACCESS_KEY'>Access Key ID</Label>
                      <div className='relative'>
                        <Key className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='AWS_S3_ACCESS_KEY'
                          placeholder='AKIAIOSFODNN7EXAMPLE'
                          className='pl-9 h-11'
                          value={formData.AWS_S3_ACCESS_KEY || ''}
                          onChange={(e) => handleChange('AWS_S3_ACCESS_KEY', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='AWS_S3_SECRET_KEY'>Secret Access Key</Label>
                      <div className='relative'>
                        <Key className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='AWS_S3_SECRET_KEY'
                          type='password'
                          placeholder='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
                          className='pl-9 h-11'
                          value={formData.AWS_S3_SECRET_KEY || ''}
                          onChange={(e) => handleChange('AWS_S3_SECRET_KEY', e.target.value)}
                        />
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        Secret keys are encrypted at rest.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* AZURE BLOB */}
              <TabsContent value='AZURE_BLOB' className='p-6 m-0 animate-in fade-in duration-300'>
                <div className='rounded-lg bg-muted/50 p-4 border border-border flex gap-3 max-w-xl'>
                  <AlertCircle className='h-5 w-5 text-primary mt-0.5' />
                  <div>
                    <h4 className='font-medium text-foreground'>Under Construction</h4>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Azure Blob Storage configuration interface is being rolled out in the next
                      update. Please use Local Storage or Amazon S3 in the meantime.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <div className='p-6 border-t border-border bg-muted/50 rounded-b-lg'>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isUpdating}
                  className='h-11 px-8 gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
                >
                  {isUpdating ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Save className='h-4 w-4' />
                  )}
                  Save Provider Settings
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
