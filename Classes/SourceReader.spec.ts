import { fileURLToPath } from "url";
import { SourceReader } from "./SourceReader";

describe("SourceReader", () => {

	it("should throw an error for a bad file path", () => {

		const testPath = "../../non-existent-file.whoops";
		const sr = new SourceReader(testPath);

		try{
			sr.getSourceParts("noddy.comp");
			fail( "Expected an Exception");
		}
		catch(ex){
			if( !ex.message ){
				fail("Exected the exception to have a message property");
			}

			console.log(ex.message);
			expect(true).toBe(true);
		}
    });

	it("should read the file", () => {

		const sr = new SourceReader("dummy");

		try{
			(sr as any).getFileContents("SourceReader.spec.ts");
			expect(true).toBe(true);
		}
		catch(ex){
			if( !ex.message ){
				fail("Exected the exception to have a message property");
			}

			console.log(ex.message);
			fail("The file was not found");
		}
    });

});