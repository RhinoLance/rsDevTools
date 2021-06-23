import { FormType, Module } from "./Module";
import { ModuleProcessor } from "./ModuleProcessor";

describe("ModuleProcessor", () => {

	const _config = {
		name: "test",
		url: "none",
		token: "000",
		moduleId: "000",
		classMap: [{
			className: "test",
			classId: "test",
			componentName: "TestComponent",
			sourceFolder: "./",
			templateFilePath: "./dummy"
		}]
	};

	const _testTemplate = {
		name: "templateClass",
		id: "test",
		type: FormType.source,
		icon: "",
		statusDef: [],
		ratingDef: [],
		ratingDefId: "majorModerateMinor",
		fieldList: [],
		source: {
			mode: "html",
			html: "",
			javascript: "",
			css: ""
		}

	};

	const _testModule = {
		name: "test",
		password: "test",
		colour: "#ababab",
		archiveAge: 30,
		mapFeatures: "[]",
		definition: [
			{
				name: "moduleClass",
				id: "test",
				type: FormType.source,
				icon: "",
				statusDef: [],
				ratingDef: [],
				ratingDefId: "majorModerateMinor",
				fieldList: [],
				source: {
					mode: "html",
					html: "",
					javascript: "",
					css: ""
				}
			}
		]
	};

	it( "updateClass_withoutTemplate_moduleClassShouldRemainUnchanged", (done)=> {


		const testModule = JSON.parse(JSON.stringify(_testModule));

		const mp = new ModuleProcessor(_config);
		spyOn<any>(mp, "getModule").and.returnValue(Promise.resolve(testModule));

		mp.updateClass(_config.classMap[0], {html: "",javascript: "",css: ""}).then( result => {
			expect(testModule.definition[0].name).toBe("test");
			done();
		});

	});

	it( "updateClass_withTemplate_moduleClassShouldUpdateToTemplateValues", (done)=> {


		const testModule = JSON.parse(JSON.stringify(_testModule));
		const testTemplate = JSON.parse(JSON.stringify(_testTemplate));
		const mp = new ModuleProcessor(_config);
		spyOn<any>(mp, "getModule").and.returnValue(Promise.resolve(testModule));

		mp.updateClass(_config.classMap[0], {html: "",javascript: "",css: ""}, testTemplate).then( result => {
			expect(testModule.definition[0].name).toBe("test");
			done();
		});

	});

	it( "updateClass_withoutTemplateOrModuleClass_shouldThrowEx", (done)=> {


		const testModule = <Module>JSON.parse(JSON.stringify(_testModule));
		testModule.definition = [];
		const mp = new ModuleProcessor(_config);
		spyOn<any>(mp, "getModule").and.returnValue(Promise.resolve(testModule));

		mp.updateClass(_config.classMap[0], {html: "",javascript: "",css: ""})
		.then( result => {
			fail("Exected an exception to be thrown");
			done();
		})
		.catch( error => {
			expect(true).toBe(true);
			done();
		});

	});

	it("updateMapFeatures_shouldExist", ()=> {

		const mp = new ModuleProcessor(_config);

		expect( mp.updateMapFeatures).toBeDefined();
	});

	it("updateMapFeatures_noMapFeatures_throwError", ()=> {

		const mp = new ModuleProcessor(_config);
		let empty: any;

		expect( ()=> {mp.updateMapFeatures(empty)}).toThrow(new Error("No map features were provided"));
	});



	it("updateMapFeatures_MapFeatures_provideResultString", (done)=> {

		const testModule = <Module>JSON.parse(JSON.stringify(_testModule));
		let data = [{name: "One"}, {name: "two"}, {name: "three"}];

		const mp = new ModuleProcessor(_config);
		spyOn<any>(mp, "getModule").and.returnValue(Promise.resolve(testModule));

		mp.updateMapFeatures(data).then(result => {

			const length = JSON.stringify(data).length/1000;
			const names = data.map(v=> v.name).join(", ");

			expect( result ).toBe(`Added ${length} map features (${length} kB): ${names}`);
			done();

		});
	});

});