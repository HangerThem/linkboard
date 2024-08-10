import { Git } from "react-bootstrap-icons";
import { SourceContainer } from "@/components/source/sourceStyles";

export default function Source() {
  return (
    <SourceContainer
      href="https://github.com/hangerthem/linkboard"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Git size={24} />
    </SourceContainer>
  );
}
