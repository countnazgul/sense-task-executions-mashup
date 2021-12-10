<script>
  export let task;
</script>

<task>
  <div class="name">{task.name}</div>
  <div>{task.executionResults.length}</div>
  <div>{task.id}</div>
  <div>{task.enabled ? "Yes" : "No"}</div>
  <div>{task.taskTypeString}</div>
  <div>
    {task.operational.lastExecutionResult.statusString}
  </div>
</task>

<style>
  task {
    display: grid;
    grid-template-columns: 10fr 3fr 8fr 2fr 4fr 4fr;
  }
</style>
