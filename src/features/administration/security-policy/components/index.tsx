"use client";

import { useState } from "react";
import { Save, Fingerprint, Lock, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";

const ROLES = ["super_admin", "admin", "noc", "sales", "technician", "finance", "cs_agent"];

interface MfaRoleConfig {
  role: string;
  required: boolean;
  method: "totp" | "sms" | "email" | "any";
  grace_period_days: number;
}

interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  max_age_days: number;
  prevent_reuse_count: number;
  lockout_attempts: number;
  lockout_duration_minutes: number;
}

interface SessionPolicy {
  session_timeout_minutes: number;
  max_concurrent_sessions: number;
  require_reauth_for_sensitive: boolean;
  sensitive_actions: string[];
  allow_remember_device: boolean;
  remember_device_days: number;
}

const DEFAULT_MFA: MfaRoleConfig[] = ROLES.map((role) => ({
  role,
  required: ["super_admin", "admin", "finance"].includes(role),
  method: "totp",
  grace_period_days: 7,
}));

const DEFAULT_PASSWORD: PasswordPolicy = {
  min_length: 8,
  require_uppercase: true,
  require_lowercase: true,
  require_numbers: true,
  require_symbols: false,
  max_age_days: 90,
  prevent_reuse_count: 5,
  lockout_attempts: 5,
  lockout_duration_minutes: 30,
};

const DEFAULT_SESSION: SessionPolicy = {
  session_timeout_minutes: 480,
  max_concurrent_sessions: 3,
  require_reauth_for_sensitive: true,
  sensitive_actions: ["schema_publish", "user_role_assign", "billing_approve"],
  allow_remember_device: true,
  remember_device_days: 30,
};

export function SecurityPolicyPage() {
  const [mfa, setMfa] = useState<MfaRoleConfig[]>(DEFAULT_MFA);
  const [password, setPassword] = useState<PasswordPolicy>(DEFAULT_PASSWORD);
  const [session, setSession] = useState<SessionPolicy>(DEFAULT_SESSION);
  const [saved, setSaved] = useState(false);

  const updateMfa = (role: string, field: keyof MfaRoleConfig, value: unknown) => {
    setMfa((prev) =>
      prev.map((m) => (m.role === role ? { ...m, [field]: value } : m)),
    );
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("ion_security_policy", JSON.stringify({ mfa, password, session }));
    setSaved(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Security Policy" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            MFA & Security Policy
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure authentication, password, and session security requirements
          </p>
        </ToolbarHeading>
        <Button variant="primary" onClick={handleSave}>
          <Save className="size-4" /> {saved ? "Saved" : "Save Changes"}
        </Button>
      </Toolbar>

      <Tabs defaultValue="mfa" className="mt-5">
        <TabsList className="mb-5">
          <TabsTrigger value="mfa" className="gap-2">
            <Fingerprint className="size-4" /> MFA Settings
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="size-4" /> Password Policy
          </TabsTrigger>
          <TabsTrigger value="session" className="gap-2">
            <Clock className="size-4" /> Session Policy
          </TabsTrigger>
        </TabsList>

        {/* MFA Tab */}
        <TabsContent value="mfa">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">MFA Requirements per Role</CardTitle>
              <CardToolbar>
                <Badge variant="secondary" appearance="light" size="sm">
                  {mfa.filter((m) => m.required).length}/{ROLES.length} roles require MFA
                </Badge>
              </CardToolbar>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-36">Role</th>
                      <th className="px-4 py-2.5 font-medium text-muted-foreground text-center w-24">Required</th>
                      <th className="px-4 py-2.5 font-medium text-muted-foreground w-44">Method</th>
                      <th className="px-4 py-2.5 font-medium text-muted-foreground w-40">Grace Period (days)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mfa.map((m) => (
                      <tr key={m.role} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium capitalize">{m.role.replace(/_/g, " ")}</td>
                        <td className="px-4 py-3 text-center">
                          <Switch
                            checked={m.required}
                            onCheckedChange={(v) => updateMfa(m.role, "required", v)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={m.method}
                            onValueChange={(v) => updateMfa(m.role, "method", v)}
                            disabled={!m.required}
                          >
                            <SelectTrigger className="h-8 text-xs w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="totp">TOTP (Authenticator App)</SelectItem>
                              <SelectItem value="sms">SMS OTP</SelectItem>
                              <SelectItem value="email">Email OTP</SelectItem>
                              <SelectItem value="any">Any Method</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            min={0}
                            max={30}
                            value={m.grace_period_days}
                            onChange={(e) => updateMfa(m.role, "grace_period_days", Number(e.target.value))}
                            disabled={!m.required}
                            className="h-8 text-xs w-24"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Policy Tab */}
        <TabsContent value="password">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Complexity Requirements</CardTitle>
                <CardToolbar />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Minimum Length</Label>
                  <Input
                    type="number"
                    min={6}
                    max={32}
                    value={password.min_length}
                    onChange={(e) => { setPassword({ ...password, min_length: Number(e.target.value) }); setSaved(false); }}
                  />
                </div>
                {(["require_uppercase", "require_lowercase", "require_numbers", "require_symbols"] as const).map((field) => (
                  <div key={field} className="flex items-center justify-between">
                    <Label className="text-sm capitalize">
                      {field.replace("require_", "Require ").replace(/_/g, " ")}
                    </Label>
                    <Switch
                      checked={password[field]}
                      onCheckedChange={(v) => { setPassword({ ...password, [field]: v }); setSaved(false); }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expiry & Lockout</CardTitle>
                <CardToolbar />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Password Max Age (days, 0 = never)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={password.max_age_days}
                    onChange={(e) => { setPassword({ ...password, max_age_days: Number(e.target.value) }); setSaved(false); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Prevent Reuse (last N passwords)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={24}
                    value={password.prevent_reuse_count}
                    onChange={(e) => { setPassword({ ...password, prevent_reuse_count: Number(e.target.value) }); setSaved(false); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Failed Attempts Before Lockout
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={password.lockout_attempts}
                    onChange={(e) => { setPassword({ ...password, lockout_attempts: Number(e.target.value) }); setSaved(false); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Lockout Duration (minutes)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={password.lockout_duration_minutes}
                    onChange={(e) => { setPassword({ ...password, lockout_duration_minutes: Number(e.target.value) }); setSaved(false); }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Session Policy Tab */}
        <TabsContent value="session">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Session Limits</CardTitle>
                <CardToolbar />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    type="number"
                    min={5}
                    value={session.session_timeout_minutes}
                    onChange={(e) => { setSession({ ...session, session_timeout_minutes: Number(e.target.value) }); setSaved(false); }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(session.session_timeout_minutes / 60)}h {session.session_timeout_minutes % 60}m
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Max Concurrent Sessions per User
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={session.max_concurrent_sessions}
                    onChange={(e) => { setSession({ ...session, max_concurrent_sessions: Number(e.target.value) }); setSaved(false); }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Allow Remember Device</Label>
                    <p className="text-xs text-muted-foreground">Skip MFA for trusted devices</p>
                  </div>
                  <Switch
                    checked={session.allow_remember_device}
                    onCheckedChange={(v) => { setSession({ ...session, allow_remember_device: v }); setSaved(false); }}
                  />
                </div>
                {session.allow_remember_device && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Remember Device Duration (days)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={session.remember_device_days}
                      onChange={(e) => { setSession({ ...session, remember_device_days: Number(e.target.value) }); setSaved(false); }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Re-authentication</CardTitle>
                <CardToolbar />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Require Re-auth for Sensitive Actions</Label>
                    <p className="text-xs text-muted-foreground">
                      User must confirm password before performing critical operations
                    </p>
                  </div>
                  <Switch
                    checked={session.require_reauth_for_sensitive}
                    onCheckedChange={(v) => { setSession({ ...session, require_reauth_for_sensitive: v }); setSaved(false); }}
                  />
                </div>
                {session.require_reauth_for_sensitive && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Sensitive Actions
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {session.sensitive_actions.map((action) => (
                        <Badge key={action} variant="secondary" appearance="outline" size="sm">
                          {action}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Connect to backend to manage this list dynamically.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
