/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```ts
 * <Aside id="search-aside" heading="SEARCH">`
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      aria-modal
      className="overlay left-0 top-0 right-0 bottom-0 max-h-dvh"
      id={id}
      role="dialog"
    >
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside className="max-md:max-w-[300px] max-h-dvh">
        <header>
          <h3>{heading}</h3>
          <CloseAside />
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      &times;
    </a>
  );
}
