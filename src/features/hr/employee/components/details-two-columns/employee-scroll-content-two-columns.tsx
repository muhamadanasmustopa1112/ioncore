import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "../details/employee-upload";
import { EmployeeDetailsOverviewsTwoColumns } from "./employee-details-overview-two-columns";

export function EmployeeScrollContentTwoColumns() {
  return (
    <div className="flex flex-col grow">
      <div className="w-full shrink-0 py-5 px-5 space-y-4">
        <Upload />
      </div>

      <div className="grow lg:border-s border-border space-y-5 py-5 lg:px-5">
        <Tabs
          defaultValue="overview"
          className="w-auto text-sm text-muted-foreground"
        >
          <TabsList className="inline-flex w-auto grow-0 mb-2.5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="billin">Billing Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <EmployeeDetailsOverviewsTwoColumns />
          </TabsContent>
          <TabsContent value="orders">
            <>Tab 2</>
          </TabsContent>
          <TabsContent value="invoices">
            <>Tab 3</>
          </TabsContent>
          <TabsContent value="billin">
            <>Tab 4</>
          </TabsContent>
          <TabsContent value="reviews">
            <>Tab 5</>
          </TabsContent>
          <TabsContent value="activity">
            <>Tab 6</>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
