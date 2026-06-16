# API Endpoints

## Sessions (trace workflow)
- `POST /api/upload` - upload image, auto-detect corners
- `POST /api/sessions/{id}/corners` - set corners, apply perspective correction
- `POST /api/sessions/{id}/trace` - AI trace tool outlines
- `POST /api/sessions/{id}/trace-mask` - trace from uploaded mask
- `PUT /api/sessions/{id}/polygons` - save polygon edits
- `POST /api/sessions/{id}/save-tools` - convert traced polygons to library tools
- `GET /api/sessions` - list sessions
- `GET /api/sessions/{id}` - get session state
- `PATCH /api/sessions/{id}` - update session metadata
- `DELETE /api/sessions/{id}` - delete session

## Tools (library)
- `GET /api/tools` - list tools (`parametric` flag marks shape-designed tools)
- `GET /api/tools/{id}` - get tool
- `POST /api/tools` - create a parametric tool from shape primitives (defaults to a 40x40 rect)
- `PUT /api/tools/{id}` - update tool, returns the full Tool. For parametric tools, send `shapes`
  (compiled server-side into points/interior_rings; 422 if the result isn't a single connected
  outline) -- direct `points` edits are rejected until `shapes: null` detaches it to a plain
  polygon. `clearance_override` (mm) beats the bin's `cutout_clearance` during generation;
  `spacing_override` (mm) beats the bin's `tool_spacing` when the frontend auto-arranges
  (keep-out air gap only — never changes pocket geometry).
- `DELETE /api/tools/{id}` - delete tool

Shape primitives (`ToolShape`): `rectangle` (width/height/corner_radius), `ellipse` (rx/ry),
`line` (guide only); `mode` is `add` | `subtract` (island) | `guide` (construction, excluded
from the outline). All dimensions mm, positions in tool space, materialization recentres the
result on the bounding-box midpoint. Add-shapes may carry `depth` (mm from the bin top);
compiling then also materializes `Tool.levels`, which the generator cuts as one prism per
level for stepped pockets (see docs/stl-generation.md). See
`backend/app/services/shape_compiler.py`.

## Bins
- `GET /api/bins` - list bins
- `GET /api/bins/{id}` - get bin (syncs placed tools with library versions)
- `POST /api/bins` - create bin (optionally with tool_ids for auto-sizing)
- `PUT /api/bins/{id}` - update bin
- `DELETE /api/bins/{id}` - delete bin + output files
- `POST /api/bins/{id}/generate` - generate STL/3MF from bin

## File serving
- `GET /api/files/{session_id}/bin.stl` - session STL
- `GET /api/files/{session_id}/bin.3mf` - session 3MF
- `GET /api/files/{session_id}/bin_parts.zip` - session split parts
- `GET /api/files/bins/{bin_id}/bin.stl` - bin STL
- `GET /api/files/bins/{bin_id}/bin.3mf` - bin 3MF
- `GET /api/files/bins/{bin_id}/bin_parts.zip` - bin split parts
