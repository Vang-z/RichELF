import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {FilePond} from "react-filepond";
import "filepond/dist/filepond.min.css"
import "./FileUpload.css"
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {BASE_URL} from "../../../utils/api";
import {useSelector} from "../../../redux/hooks";
import {incrementalMD5} from "../../../utils/util";
import {editorSlice} from "../../../redux/editor/slice";


export const FileUpload: React.FC = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const auth = useSelector(s => s.auth)
  const file = useSelector(s => s.editor.file)
  const [identifier, setIdentifier] = useState('')

  return <>
    <FilePond
      // 重写 filepond 上传方法
      server={{
        process: async (fieldName, file, metadata, load, error, progress, abort) => {
          // fieldName is the name of the input field
          // file is the actual file object to send
          const md5 = await incrementalMD5(file)
          let formData = new FormData();
          formData.append('file', file)
          formData.append('filesize', file.size.toString())
          formData.append('category', 'packages')
          formData.append('identifier', md5 as string)
          const request = new XMLHttpRequest();
          request.open('POST', `${BASE_URL}/file/upload`);
          request.setRequestHeader('Authorization', `${auth.tokenType} ${auth.accessToken}`)

          // Should call the progress method to update the progress to 100% before calling load
          // Setting computable to false switches the loading indicator to infinite mode
          request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          };

          // Should call the load method when done and pass the returned server file id
          // this server file id is then used later on when reverting or restoring a file
          // so your server knows which file to return without exposing that info to the client
          request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
              // the load method accepts either a string (id) or an object
              setIdentifier(`packages_${md5}`)
              load(request.responseText);
            } else {
              // Can call the error method if something is wrong, should exit after
              error('upload error');
            }
          };

          request.send(formData);
          // Should expose an abort method so the request can be cancelled
          return {
            abort: () => {
              // This function is entered if the user has tapped the cancel button
              request.abort();

              // Let FilePond know the request has been cancelled
              abort();
            },
          };
        },
        revert: () => {
        },
        remove: () => {
        },
        restore: () => {
        },
      }}
      onremovefile={() => {
        dispatch(editorSlice.actions.dispatchFile(null))
      }}
      onprocessfile={(error, file) => {
        if (file.status === 5) {
          dispatch(editorSlice.actions.dispatchFile({
            filesize: file.file.size,
            filename: file.filename,
            fid: identifier
          }))
          enqueueSnackbar(t(`enqueueSnackbar.uploadSuccess`), {
            variant: "success",
            action: key => <IconButton
              disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
          })
          return
        } else {
          enqueueSnackbar(t(`enqueueSnackbar.uploadFailed`), {
            variant: "warning",
            action: key => <IconButton
              disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
          })
          return
        }
      }}
      files={file?.filename ? [{
        source: '#',
        options: {type: 'input', file: {name: file.filename, size: file.filesize}}
      }] : []}
      maxFiles={1}
      fileSizeBase={1024}
      instantUpload={false}
      labelIdle={`<div style="display: flex"><svg style="width: 24px; height: 24px; margin-right: 6px;" class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M0 0h24v24H0z"></path><path fill="#fff" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>${t(`fileUpload.labelIdle`)}</div>`}
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