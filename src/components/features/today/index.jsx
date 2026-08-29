
import TodayUpdate from "./update";


function TodayFeature() {
  return (
    <>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex w-full items-center justify-start gap-7 rounded-lg px-4 py-3">
          <h1 className="text-5xl font-bold text-black">Today</h1>
          <span className="rounded bg-gray-200 px-2 py-1 text-2xl font-semibold">
            2
          </span>
        </div>
      </div>
      <TodayUpdate />
    </>
  );
}

export default TodayFeature;
