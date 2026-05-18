import DataGrid, {
  Column,
  SearchPanel,
  Paging,
  FilterRow
} from "devextreme-react/data-grid";

import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";

export default function UsersTable({
  users,
  handleToggleBan
}) {
  return (
    <Card className="p-6">

      <h2 className="
        mb-4
        text-lg
        font-semibold
      ">
        Users List
      </h2>

      <DataGrid
        dataSource={users}
        showBorders
        columnAutoWidth
      >

        <SearchPanel visible />

        <FilterRow visible />

        <Paging
          defaultPageSize={5}
        />

        <Column
          dataField="name"
        />

        <Column
          dataField="email"
        />

        <Column
          dataField="role"
        />

        <Column
          dataField="isBanned"
          caption="Status"
          cellRender={(data) => (
            <Badge
              variant={
                data.value
                  ? "danger"
                  : "success"
              }
            >
              {data.value
                ? "Banned"
                : "Active"}
            </Badge>
          )}
        />

        <Column
          caption="Action"
          cellRender={(data) => {

            const isBanned =
              data.data.isBanned;

            return (
              <Button
                size="sm"
                variant={
                  isBanned
                    ? "secondary"
                    : "danger"
                }
                onClick={() =>
                  handleToggleBan(
                    data.data.id,
                    isBanned
                  )
                }
              >
                {isBanned
                  ? "Unban"
                  : "Ban"}
              </Button>
            );
          }}
        />

      </DataGrid>

    </Card>
  );
}