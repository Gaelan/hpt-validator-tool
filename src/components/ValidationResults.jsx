import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { Grid, Alert, Table } from "@trussworks/react-uswds"

const createCsvString = (errors, warnings) =>
  "location,message,type\n" +
  errors
    .map(
      ({ path, message }) => `"${path}","${message.replace(/"/gi, "")}","error"`
    )

    .join("\n") +
  "\n" +
  warnings
    .map(
      ({ path, message }) =>
        `"${path}","${message.replace(/"/gi, "")}","warning"`
    )
    .join("\n")

const ValidationResults = ({
  filename,
  filenameValid,
  valid,
  errors,
  warnings,
  locationHeader,
  loading,
  didMount,
}) => {
  const resultsHeaderRef = useRef(null)

  const blob = new Blob([createCsvString(errors, warnings)], {
    type: "text/csv;charset=utf-8",
  })
  const downloadUrl = window.URL.createObjectURL(blob)

  useEffect(() => {
    if (didMount && !loading && resultsHeaderRef.current) {
      resultsHeaderRef.current.scrollIntoView({
        behavior: "smooth",
        align: "top",
      })
      resultsHeaderRef.current.focus()
    }
  }, [didMount, loading])

  return (
    <Grid row gap>
      <div className="usa-prose width-full">
        <h2 id="validation-results-header" tabIndex="-1" ref={resultsHeaderRef}>
          Validation results
        </h2>

        <div id="validation-results-body">
          {loading && (
            <p className="font-sans-l loading-skeleton">
              Your file is processing. Some larger files may take a minute or
              two. Results will appear here once completed. If you are
              experiencing issues, please let us know at :{" "}
              <a href="mailto:PriceTransparencyHospitalCharges@cms.hhs.gov">
                PriceTransparencyHospitalCharges@cms.hhs.gov
              </a>
              .
            </p>
          )}
          {!loading && filename && (
            <>
              <a
                className="usa-button"
                href={downloadUrl}
                download="cms-hpt-validator-results.csv"
              >
                Download results as spreadsheet
              </a>
              <h3>File name</h3>
              <Alert
                type={filenameValid ? `success` : `error`}
                aria-live="polite"
                aria-atomic="true"
              >
                {filenameValid ? (
                  <>
                    <span className="text-bold">File name valid</span>:{" "}
                    <span className="text-underline">{filename}</span>
                  </>
                ) : (
                  <>
                    <span className="text-bold">File name invalid</span>:{" "}
                    <span className="text-underline">{filename}</span>
                    <br />
                    <span>
                      Must match format:
                      &lt;ein&gt;_&lt;hospitalname&gt;_standardcharges.[json|csv].{" "}
                      <a href={`${import.meta.env.BASE_URL}filename-wizard`}>
                        Click here to use the file name wizard.
                      </a>
                    </span>
                  </>
                )}
              </Alert>
              <h3>Errors</h3>
              <Alert
                type={valid ? `success` : `error`}
                aria-live="polite"
                aria-atomic="true"
              >
                {valid ? (
                  <>
                    <span className="text-bold">No errors found in file</span>:{" "}
                    <span className="text-underline">{filename}</span>
                  </>
                ) : (
                  <>
                    <span className="text-bold">
                      {errors.length === 1
                        ? "1 error"
                        : `${errors.length} errors`}{" "}
                      found in file
                    </span>
                    : <span className="text-underline">{filename}</span>
                  </>
                )}
              </Alert>
              {errors.length > 0 && (
                <>
                  <Table className="width-full" bordered striped>
                    <thead>
                      <tr>
                        <th scope="col">{locationHeader}</th>
                        <th scope="col">Error description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errors.map(({ path, message }, index) => (
                        <tr key={index}>
                          <td>{path}</td>
                          <td>{message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <p>
                    For further information about resolving these issues, please
                    refer to the document:{" "}
                    <a href="https://www.cms.gov/files/document/steps-machine-readable-file.pdf">
                      8 Steps to a Machine-Readable File
                    </a>
                  </p>
                </>
              )}
              <h3>Warnings</h3>
              <Alert type={warnings.length === 0 ? `success` : `warning`}>
                {warnings.length === 0 ? (
                  <>
                    <span className="text-bold">No warnings found in file</span>
                    : <span className="text-underline">{filename}</span>
                  </>
                ) : (
                  <>
                    <span className="text-bold">
                      {warnings.length === 1
                        ? "1 warning"
                        : `${warnings.length} warnings`}{" "}
                      for file
                    </span>
                    : <span className="text-underline">{filename}</span>
                    <br />
                    <span>
                      These items are not required changes, but addressing them
                      could save time in the future.
                    </span>
                  </>
                )}
              </Alert>
              {warnings.length > 0 && (
                <Table className="width-full" bordered striped>
                  <thead>
                    <tr>
                      <th scope="col">{locationHeader}</th>
                      <th scope="col">Error description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warnings.map(({ path, message }, index) => (
                      <tr key={index}>
                        <td>{path}</td>
                        <td>{message}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </div>
      </div>
    </Grid>
  )
}

ValidationResults.propTypes = {
  filename: PropTypes.string,
  filenameValid: PropTypes.bool,
  valid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.object),
  warnings: PropTypes.arrayOf(PropTypes.object),
  locationHeader: PropTypes.string,
  loading: PropTypes.bool,
  didMount: PropTypes.bool,
}

export default ValidationResults
