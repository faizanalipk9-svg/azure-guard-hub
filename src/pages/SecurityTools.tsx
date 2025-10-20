import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Mail, Hash, Globe, FileText } from 'lucide-react';
import { useState } from 'react';

const SecurityTools = () => {
  const [whoisResult, setWhoisResult] = useState('');
  const [ipRepResult, setIpRepResult] = useState('');
  const [hashResult, setHashResult] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Tools</h1>
        <p className="text-muted-foreground">
          Utilities and tools for security analysis
        </p>
      </div>

      <Tabs defaultValue="whois" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="whois">WHOIS Lookup</TabsTrigger>
          <TabsTrigger value="ip">IP Reputation</TabsTrigger>
          <TabsTrigger value="hash">Hash Lookup</TabsTrigger>
          <TabsTrigger value="email">Email Analysis</TabsTrigger>
          <TabsTrigger value="sandbox">File Sandbox</TabsTrigger>
        </TabsList>

        {/* WHOIS Lookup */}
        <TabsContent value="whois">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                WHOIS Domain Lookup
              </CardTitle>
              <CardDescription>
                Query domain registration and ownership information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="domain"
                    placeholder="example.com"
                    className="flex-1"
                  />
                  <Button onClick={() => setWhoisResult('Domain: example.com\nRegistrar: Example Registrar Inc.\nCreated: 2020-01-15\nExpires: 2025-01-15\nStatus: Active')}>
                    <Search className="h-4 w-4 mr-2" />
                    Lookup
                  </Button>
                </div>
              </div>
              {whoisResult && (
                <div className="space-y-2">
                  <Label>Results</Label>
                  <Textarea
                    value={whoisResult}
                    readOnly
                    className="font-mono text-sm h-48"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* IP Reputation */}
        <TabsContent value="ip">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                IP Reputation Checker
              </CardTitle>
              <CardDescription>
                Check IP address reputation and threat intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip">IP Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="ip"
                    placeholder="192.168.1.1"
                    className="flex-1"
                  />
                  <Button onClick={() => setIpRepResult('IP: 192.168.1.1\nReputation: Clean\nCountry: United States\nISP: Example ISP\nThreat Level: Low\nLast Seen: Never in threat feeds')}>
                    <Search className="h-4 w-4 mr-2" />
                    Check
                  </Button>
                </div>
              </div>
              {ipRepResult && (
                <div className="space-y-2">
                  <Label>Results</Label>
                  <Textarea
                    value={ipRepResult}
                    readOnly
                    className="font-mono text-sm h-48"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hash Lookup */}
        <TabsContent value="hash">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Hash Lookup
              </CardTitle>
              <CardDescription>
                Check file hash against threat databases (MD5, SHA256)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hash">File Hash</Label>
                <div className="flex gap-2">
                  <Input
                    id="hash"
                    placeholder="Enter MD5 or SHA256 hash"
                    className="flex-1"
                  />
                  <Button onClick={() => setHashResult('Hash Type: SHA256\nStatus: Clean\nFirst Seen: 2023-06-15\nDetections: 0/67\nFile Type: Executable\nSize: 2.4 MB')}>
                    <Search className="h-4 w-4 mr-2" />
                    Lookup
                  </Button>
                </div>
              </div>
              {hashResult && (
                <div className="space-y-2">
                  <Label>Results</Label>
                  <Textarea
                    value={hashResult}
                    readOnly
                    className="font-mono text-sm h-48"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Header Analysis */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Header Analyzer
              </CardTitle>
              <CardDescription>
                Analyze email headers for phishing and spoofing attempts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headers">Email Headers</Label>
                <Textarea
                  id="headers"
                  placeholder="Paste email headers here..."
                  className="font-mono text-sm h-48"
                />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Analyze Headers
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Sandbox */}
        <TabsContent value="sandbox">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Sandbox Analyzer
              </CardTitle>
              <CardDescription>
                Upload and analyze suspicious files in a secure sandbox
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop file here or click to browse
                </p>
                <Button>Choose File</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 50MB. Supported formats: EXE, DLL, PDF, DOC, ZIP
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityTools;
