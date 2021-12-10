<script>
  import { AccordionItem } from "carbon-components-svelte";
  import ExecutionResults from "./ExecutionResults.svelte";
  import Task from "./Task.svelte";
  import TaskDetails from "./TaskDetails.svelte";
  export let task;
</script>

<AccordionItem>
  <div slot="title">
    <Task {task} />
  </div>
  <div class="accordion-content">
    <div>
      <TaskDetails {task} />
    </div>
    <div>
      <ExecutionResults
        executionResults={task.executionResults}
        taskName={task.name}
        taskId={task.id}
      />
    </div>
  </div>
</AccordionItem>

<style>
  :global(.bx--accordion__content) {
    padding-right: 0% !important;
    padding-left: 0% !important;
  }

  .accordion-content {
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
  }
</style>
