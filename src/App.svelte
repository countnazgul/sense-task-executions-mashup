<script>
  import {
    Accordion,
    Loading,
    Search,
    Tile,
    Theme,
  } from "carbon-components-svelte";
  import "carbon-components-svelte/css/all.css";
  import BrightnessContrast24 from "carbon-icons-svelte/lib/BrightnessContrast24";
  import LogoGithub24 from "carbon-icons-svelte/lib/LogoGithub24";
  import { taskExecutionStatus, taskTypes } from "./lib/enum";
  import Task from "./components/AccordionItem.svelte";
  import { Get } from "./lib/getData";

  let searchTerm = undefined;
  let tasksData = [];
  let theme = "g90";
  $: fill = theme == "g90" ? "white" : "black";

  $: tasksDataFiltered = tasksData;

  async function getExecutionResults() {
    return await Get("executionresult/full");
  }

  async function getReloadTasks() {
    return await Get("task/full");
  }

  async function loadData() {
    let [executionResults, tasks] = await Promise.all([
      getExecutionResults()
        .then((ex) => ex.data)
        .then((d) =>
          d.filter((e) => e.startTime != "1753-01-01T00:00:00.000Z")
        ),
      getReloadTasks().then((t) => t.data),
      new Promise((resolve, reject) => {
        let wait = setTimeout(() => {
          clearTimeout(wait);
          resolve();
        }, 1000);
      }),
    ]);

    const enrichedTasks = tasks.map((task) => {
      task.executionResults = executionResults.filter(
        (r) => r.taskID == task.id
      );

      task["taskTypeString"] = taskTypes[task.taskType];
      task.operational.lastExecutionResult["statusString"] =
        taskExecutionStatus[task.operational.lastExecutionResult.status];

      return task;
    });

    tasksData = orderBy(enrichedTasks, (h) => h.name);
    return true;
  }

  function orderBy(data, selector, desc = false) {
    return [...data].sort((a, b) => {
      a = selector(a);
      b = selector(b);

      if (a == b) return 0;
      return (desc ? a > b : a < b) ? -1 : 1;
    });
  }

  function searchChanged(ev) {
    if (searchTerm === "") {
      tasksDataFiltered = tasksData;
      return;
    }

    tasksDataFiltered = tasksData.filter(
      (t) =>
        t.name.toLowerCase().indexOf(searchTerm) > -1 ||
        t.id.toLowerCase().indexOf(searchTerm) > -1 ||
        t.app?.id.toLowerCase().indexOf(searchTerm) > -1 ||
        t.app?.name.toLowerCase().indexOf(searchTerm) > -1
    );
  }
</script>

<main>
  {#await loadData()}
    <Loading />
  {:then _}
    <div class="title">
      RELOAD TASKS AND EXECUTIONS
      <div class="theme-switcher">
        <switcher>
          <Theme
            bind:theme
            render="toggle"
            toggle={{
              themes: ["white", "g90"],
              hideLabel: true,
              labelA: "",
              labelB: "",
              size: "sm",
            }}
          />
        </switcher>
        <div class="link" title="Toggle theme">
          <BrightnessContrast24
            style="fill: {fill}"
            on:click={() => {
              theme == "white" ? (theme = "g90") : (theme = "white");
            }}
          />
        </div>
        <a
          class="link"
          title="Source code"
          href="https://github.com/countnazgul/sense-task-executions-mashup"
          target="_blank"
        >
          <LogoGithub24 style="fill: {fill}" />
        </a>
      </div>
    </div>
    <div class="search">
      <Search
        size="sm"
        placeholder="Search by Task ID, Task Name, App ID or App Name (press Enter to submit)"
        bind:value={searchTerm}
        on:change={searchChanged}
        on:clear={searchChanged}
      />
    </div>
    <Tile>
      <div class="table-header">
        <div>Name</div>
        <div>Executions</div>
        <div>ID</div>
        <div>Enabled</div>
        <div>Type</div>
        <div>Status</div>
      </div></Tile
    >

    <Accordion size="xl">
      {#each tasksDataFiltered as task}
        <Task {task} />
      {/each}
    </Accordion>
  {/await}
</main>

<style>
  :global(body) {
    overflow: hidden;
  }

  main {
    margin: 0 auto;
    height: calc(100vh - 20px);
    width: calc(100vw - 20px);
    overflow: auto;
  }

  .title {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
  }

  :global(*) {
    margin: 0;
    padding: 0;
  }

  .table-header {
    display: grid;
    grid-template-columns: 10fr 3fr 8fr 2fr 4fr 4fr;
    grid-template-rows: 30px;
    align-items: center;
    font-size: 16px;
    padding-left: 20px;
    width: calc(100% - 16px);
  }

  .table-header > div {
    padding-left: 5px;
  }

  .theme-switcher {
    position: absolute;
    right: 10px;
    display: flex;
    gap: 5px;
  }

  .theme-switcher > switcher {
    display: none;
  }

  .link {
    cursor: pointer;
  }
</style>
