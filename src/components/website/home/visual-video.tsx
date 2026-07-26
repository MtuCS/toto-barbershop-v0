// export function VisualVideo() {
//   return (
//     <section className="border-b border-border bg-background">
//       <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
//         <video
//           src="/images/TotoVisual.mp4"
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//         {/* Optional overlay if needed to match premium feel, e.g., a very subtle dark gradient */}
//         <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
//       </div>
//     </section>
//   )
// }

export function VisualVideo() {
  return (
    <section className="border-b border-border bg-background py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
  <video
    src="/images/TotoVisual.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 h-full w-full object-contain"
  />
</div>
      </div>
    </section>
  )
}