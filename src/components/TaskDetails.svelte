<script>
  import { DataTable } from "carbon-components-svelte";

  export let task;

  let data = [];

  $: if (task) {
    data.push({
      id: "Task ID",
      value: task.id,
    });

    data.push({
      id: "Task Name",
      value: task.name,
    });

    if (task.app) {
      data.push({
        id: "App ID",
        value: task.app.id,
      });

      data.push({
        id: "App Name",
        value: task.app.name,
      });
    }

    if (!task.app) {
      data.push({
        id: "App ID",
        value: "Task is not associated with any app",
      });
    }

    if (task.app && task.app.stream) {
      data.push({
        id: "Stream ID",
        value: task.app.stream.id,
      });

      data.push({
        id: "Stream Name",
        value: task.app.stream.name,
      });
    }

    if (task.app && !task.app.stream) {
      data.push({
        id: "Stream ID",
        value: "App is not published",
      });
    }
  }
</script>

<div>
  <DataTable
    size="compact"
    sortable
    title="Details"
    headers={[
      { key: "id", value: "Name" },
      { key: "value", value: "Value" },
    ]}
    rows={data}
  />
</div>

<style>
</style>
