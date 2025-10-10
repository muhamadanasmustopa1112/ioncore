import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeDetailsOverviewsTwoColumns } from "../details-two-columns/employee-details-overview-two-columns";
import { Upload } from "../details/employee-upload";

export function EmployeeScrollContentTwoColumnsCard() {
  return (
    <div className="flex grow flex-col">
      <div className="w-full shrink-0 space-y-4 px-5 py-5">
        <Upload />
      </div>

      <div className="border-border grow space-y-5 py-5 lg:border-s lg:px-5">
        <Tabs
          defaultValue="overview"
          className="text-muted-foreground w-full text-sm"
        >
          <div className="relative w-full overflow-x-auto overflow-y-hidden">
            <TabsList className="mb-2.5 inline-flex w-auto overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="billin">Billing Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </div>
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
