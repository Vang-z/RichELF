import React from "react";
import {useTranslation} from "react-i18next";
import {FilePond} from "react-filepond";
import "filepond/dist/filepond.min.css"
import "./FileUpload.css"


export const FileUpload: React.FC = () => {
  const {t} = useTranslation()

  return <>
    <FilePond
      server={'/api'}
      maxFiles={1}
      instantUpload={false}
      labelIdle={`<div style="display: flex"><svg style="width: 24px; height: 24px; margin-right: 6px" class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>${t(`fileUpload.labelIdle`)}</div>`}
      labelInvalidField={t(`fileUpload.labelInvalidField`)}
      labelFileWaitingForSize={t(`fileUpload.labelFileWaitingForSize`)}
      labelFileSizeNotAvailable={t(`fileUpload.labelFileSizeNotAvailable`)}
      labelFileLoading={t(`fileUpload.labelFileLoading`)}
      labelFileLoadError={t(`fileUpload.labelFileLoadError`)}
      labelFileProcessing={t(`fileUpload.labelFileProcessing`)}
      labelFileProcessingComplete={t(`fileUpload.labelFileProcessingComplete`)}
      labelFileProcessingAborted={t(`fileUpload.labelFileProcessingAborted`)}
      labelFileProcessingError={t(`fileUpload.labelFileProcessingError`)}
      labelFileProcessingRevertError={t(`fileUpload.labelFileProcessingRevertError`)}
      labelFileRemoveError={t(`fileUpload.labelFileRemoveError`)}
      labelTapToCancel={t(`fileUpload.labelTapToCancel`)}
      labelTapToRetry={t(`fileUpload.labelTapToRetry`)}
      labelTapToUndo={t(`fileUpload.labelTapToUndo`)}
      labelButtonRemoveItem={t(`fileUpload.labelButtonRemoveItem`)}
      labelButtonAbortItemLoad={t(`fileUpload.labelButtonAbortItemLoad`)}
      labelButtonRetryItemLoad={t(`fileUpload.labelButtonRetryItemLoad`)}
      labelButtonAbortItemProcessing={t(`fileUpload.labelButtonAbortItemProcessing`)}
      labelButtonUndoItemProcessing={t(`fileUpload.labelButtonUndoItemProcessing`)}
      labelButtonRetryItemProcessing={t(`fileUpload.labelButtonRetryItemProcessing`)}
      labelButtonProcessItem={t(`fileUpload.labelButtonProcessItem`)}
    />
  </>
}