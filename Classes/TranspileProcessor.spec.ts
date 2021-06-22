import { TranspileProcessor } from "./TranspileProcessor";

describe("TranspileProcessor", () => {

	describe("html", () => {

		it( "transformHtml_withoutVersion_shouldAddVersionComment", ()=> {

			const src = "<html><body></body></html>"

			const tp = new TranspileProcessor();
			const transpiled = tp.processHtml(src);
			expect(transpiled.indexOf("<!-- Version: 1.0.0-1 -->")).toBe(-1);
		});

		it( "transformHtml_withVersion_shouldAddVersionComment", ()=> {

			const src = "<html><body></body></html>"

			const tp = new TranspileProcessor();
			const transpiled = tp.processHtml(src, "1.0.0-1");
			expect(transpiled).toContain("<!-- Version: 1.0.0-1 -->");
		});

		it( "transformHtml_withVersion_shouldAddVersionCommentAndReplace", ()=> {

			const src = "<html><body><span class='version'>VERSION_PLACEHOLDER</span></body></html>"

			const tp = new TranspileProcessor();
			const transpiled = tp.processHtml(src, "1.0.0-1");
			expect(transpiled).toContain("<!-- Version: 1.0.0-1 -->");
			expect(transpiled).toContain("<span class='version'>1.0.0-1</span>");
		});
	});

	describe("scss", () => {

		it( "transformScss_withoutVersion_shouldAddVersionComment", ()=> {

			const src = "class test{}";

			const tp = new TranspileProcessor();
			const transpiled = tp.processScss(src);
			expect(transpiled.indexOf("/* Version: 1.0.0-1 */")).toBe(-1);
		});

		it( "transformScss_withVersion_shouldAddVersionComment", ()=> {

			const src = "h1 {color:#000;}";

			const tp = new TranspileProcessor();
			const transpiled = tp.processScss(src, "1.0.0-1");
			expect(transpiled).toContain("/* Version: 1.0.0-1 */");
		});

		it( "transformScss_withVersion_shouldAddVersionCommentAndReplace", ()=> {

			const src = "h1 {color:#000; content:'VERSION_PLACEHOLDER'}";

			const tp = new TranspileProcessor();
			const transpiled = tp.processScss(src, "1.0.0-1");
			expect(transpiled).toContain("/* Version: 1.0.0-1 */");
			expect(transpiled).toContain('content: "1.0.0-1"');
		});
	});



	describe("ts", () => {

		it( "transformTs_withoutVersion_shouldAddVersionComment", ()=> {

			const src = "class test{}";

			const tp = new TranspileProcessor();
			const transpiled = tp.processTs(src);
			expect(transpiled.indexOf("/* Version: 1.0.0-1 */")).toBe(-1);
		});

		it( "transformTs_withVersion_shouldAddVersionComment", ()=> {

			const src = "class test{}";

			const tp = new TranspileProcessor();
			const transpiled = tp.processTs(src, "1.0.0-1");
			expect(transpiled).toContain("/* Version: 1.0.0-1 */");
		});

		it( "transformTs_withVersion_shouldAddVersionCommentAndReplace", ()=> {

			const src = "class test{ const version = 'VERSION_PLACEHOLDER'; }";

			const tp = new TranspileProcessor();
			const transpiled = tp.processTs(src, "1.0.0-1");
			expect(transpiled).toContain("/* Version: 1.0.0-1 */");
			expect(transpiled).toContain("version = '1.0.0-1';");
		});

		it( "transformTs_withClassTextInImport_shouldTrimFromClassDef", ()=> {

			const src = `
			import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
			import { Component, OnInit } from '@angular/core';
			import { IInspectionCategory } from 'src/app/classes/IInspectionCategory';
			import { IRhinoSpectForm } from 'src/app/classes/IRhinoSpectForm';

			@Component({
				selector: 'app-impact',
				templateUrl: './impact.component.html',
				styleUrls: ['./impact.component.scss']
			})
			export class ImpactComponent implements IRhinoSpectForm {}
			`;

			const tp = new TranspileProcessor();
			const transpiled = tp.processTs(src);
			expect(transpiled.replace(/[\n\s]/g, "")).toBe("classImpactComponent{}");

		});
	});

});