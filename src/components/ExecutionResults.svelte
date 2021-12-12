<script>
  import {
    DataTable,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Loading,
  } from "carbon-components-svelte";
  import { saveAs } from "file-saver";
  import { detailTypes, taskExecutionStatus } from "../lib/enum";
  import { Get } from "../lib/getData";

  export let executionResults;
  export let taskName;
  export let taskId;

  let modalShown = false;
  let modalDataLoaded = false;
  let modalContent = "";
  let modalLabel = "";
  let selectedExecutionId = "";

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    seconds: "numeric",
  };

  let executionResultsModified = [];
  $: if (executionResults) {
    executionResultsModified = executionResults
      .filter((r) => r.startTime != "1753-01-01T00:00:00.000Z")
      .map((result) => {
        result["detailsTypeString"] = detailTypes[result.detailTypes];
        result["statusString"] = taskExecutionStatus[result.status];
        result["startTime"] = new Date(result.startTime).toLocaleDateString(
          "en-GB",
          options
        );
        result["stopTime"] = new Date(result.stopTime).toLocaleDateString(
          "en-GB",
          options
        );
        return result;
      });
  }

  async function generateScriptLog(resultId) {
    modalDataLoaded = false;
    modalLabel = "Script log";
    modalShown = true;

    const generateLog = await Get(
      `ReloadTask/${taskId}/scriptlogfile?executionResultId=${resultId}`
    );

    const logContent = await Get(
      `download/ReloadTask/${generateLog.data.value}/${taskName}.log`
    );

    selectedExecutionId = resultId;
    modalContent = logContent.data;
    modalDataLoaded = true;
  }

  function showDetails(details, resultId) {
    modalDataLoaded = false;
    modalLabel = "Execution details";
    modalShown = true;

    let detailsMessage = details.map(
      (d) => `${d.detailCreatedDate}\t${d.message}`
    );

    if (detailsMessage.length == 0) {
      detailsMessage = "No details";
    } else {
      detailsMessage = detailsMessage.join("\r\n");
    }

    selectedExecutionId = resultId;
    modalContent = detailsMessage;
    modalDataLoaded = true;
  }

  function downloadContent() {
    const blob = new Blob([modalContent], {
      type: "text/plain;charset=utf-8",
    });

    const fileName = `${
      modalLabel.indexOf("Script") > -1 ? "Script" : "Execution"
    }_${taskName}_${selectedExecutionId}.txt`;

    saveAs(blob, fileName);
  }
</script>

<results>
  <ComposedModal
    bind:open={modalShown}
    on:submit={downloadContent}
    on:close={() => {
      modalLabel = "";
      modalContent = "";
      selectedExecutionId = "";
    }}
  >
    <ModalHeader label={modalLabel} title="{taskName} ({taskId})" />
    <ModalBody>
      <div class="modal-content">
        {#if !modalDataLoaded}
          <div class="data-loading">
            <Loading withOverlay={false} />
          </div>
        {:else}
          <pre>{modalContent}</pre>
        {/if}
      </div>
    </ModalBody>
    <ModalFooter primaryButtonText="Download" secondaryButtonText="Close" />
  </ComposedModal>

  <DataTable
    sortable
    title="Executions"
    headers={[
      { key: "id", value: "ID" },
      { key: "statusString", value: "Status" },
      { key: "executingNodeName", value: "Node" },
      { key: "startTime", value: "Started" },
      { key: "stopTime", value: "Ended" },
      { key: "scriptLogLocation", value: "Script" },
    ]}
    rows={executionResultsModified}
  >
    <span slot="cell" let:row let:cell>
      {#if cell.key === "scriptLogLocation" && cell.value.length > 0}
        <div class="link" on:click={generateScriptLog(row["id"])}>Preview</div>
      {:else if cell.key === "scriptLogLocation" && cell.value.length == 0}
        NA
      {:else if cell.key === "id" && row.details.length > 0}
        <div class="link" on:click={showDetails(row["details"], row["id"])}>
          {cell.value}
        </div>
      {:else}
        {cell.value}
      {/if}
    </span>
  </DataTable>
</results>

<style>
  :global(.bx--modal-content) {
    border-top: 1px solid;
    margin-bottom: 0px !important;
    min-height: 200px !important;
  }

  .link {
    cursor: pointer;
    color: #ff3e00;
    text-decoration: underline;
  }

  .data-loading {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
