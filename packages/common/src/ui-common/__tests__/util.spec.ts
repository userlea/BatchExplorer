import { initMockEnvironment } from "../environment";
import { cloneDeep, isArray, isPromiseLike, uniqueId } from "../util";

describe("Common utilities", () => {
    beforeEach(() => initMockEnvironment());

    test("uniqueId() function", () => {
        expect(uniqueId()).toBe("id-0");
        expect(uniqueId()).toBe("id-1");
        expect(uniqueId("foo")).toBe("foo-2");
        expect(uniqueId("bar")).toBe("bar-3");

        // Re-initializing the mock env resets the counter
        initMockEnvironment();
        expect(uniqueId()).toBe("id-0");
    });

    test("cloneDeep() function", () => {
        expect(
            cloneDeep({
                str: "bar",
                num: 123,
                obj: {
                    innerStr: "baz",
                    innerNum: 321,
                    innerObj: {
                        emptyList: [],
                    },
                    innerList: ["a", 1, 2, "b"],
                },
                list: [1, 2, "a", "b"],
            })
        ).toStrictEqual({
            str: "bar",
            num: 123,
            obj: {
                innerStr: "baz",
                innerNum: 321,
                innerObj: {
                    emptyList: [],
                },
                innerList: ["a", 1, 2, "b"],
            },
            list: [1, 2, "a", "b"],
        });
    });

    test("isPromiseLike() function", () => {
        // Promise-like
        expect(isPromiseLike(Promise.resolve())).toBe(true);
        expect(
            isPromiseLike({
                then: () => "foo",
            })
        ).toBe(true);

        // Not promise-like
        expect(isPromiseLike("nope")).toBe(false);
        expect(isPromiseLike({})).toBe(false);
        expect(
            isPromiseLike({
                then: "still nope",
            })
        ).toBe(false);
    });

    test("isArray() function", () => {
        // Arrays
        expect(isArray([])).toBe(true);
        expect(isArray(["yup"])).toBe(true);

        // Not arrays
        expect(isArray("nope")).toBe(false);
        expect(isArray(new Set([]))).toBe(false);
        expect(isArray({})).toBe(false);
    });
});