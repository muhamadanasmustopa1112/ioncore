"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNodeSelectorStore } from "../store/maintenance";
import { DUMMY_NETWORK_NODES } from "../data/dummy-maintenance";

export function NodeSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { selectedNodes, addNode, removeNode, clearNodes } = useNodeSelectorStore();

  const filteredNodes = useMemo(() => {
    if (!search) return DUMMY_NETWORK_NODES;
    const lower = search.toLowerCase();
    return DUMMY_NETWORK_NODES.filter(
      (node) =>
        node.node_name.toLowerCase().includes(lower) ||
        node.node_type.toLowerCase().includes(lower) ||
        node.area.toLowerCase().includes(lower),
    );
  }, [search]);

  const selectedNodeDetails = useMemo(
    () => DUMMY_NETWORK_NODES.filter((n) => selectedNodes.includes(n.node_id)),
    [selectedNodes],
  );

  const handleToggle = (nodeId: string) => {
    if (selectedNodes.includes(nodeId)) {
      removeNode(nodeId);
    } else {
      addNode(nodeId);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedNodes.length > 0
              ? `${selectedNodes.length} node(s) selected`
              : "Select network nodes"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="border-b p-3">
            <Input
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="p-1">
              {filteredNodes.map((node) => (
                <label
                  key={node.node_id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Checkbox
                    checked={selectedNodes.includes(node.node_id)}
                    onCheckedChange={() => handleToggle(node.node_id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{node.node_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {node.node_type.toUpperCase()} - {node.area}
                    </div>
                  </div>
                </label>
              ))}
              {filteredNodes.length === 0 && (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No nodes found.
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedNodeDetails.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedNodeDetails.map((node) => (
            <Badge key={node.node_id} variant="secondary" className="gap-1 pr-1">
              {node.node_name}
              <button
                type="button"
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                onClick={() => removeNode(node.node_id)}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={clearNodes}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
