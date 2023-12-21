
type LabelEditorProps = {
  file: File;
}

export const LabelEditor = ({ file }: LabelEditorProps) => {
  return file.name;
}