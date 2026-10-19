"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
  options?: CustomSelectOption[];
  children?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  panelClassName?: string;
  variant?: "default" | "underline" | "sentence";
  searchable?: boolean;
  searchPlaceholder?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * CustomSelect
 * An accessible, dark glass-themed select and combobox replacement for native dropdown elements.
 * Features:
 * - Themed dark glass styling matching BetaDigest design tokens
 * - Search / type-to-filter for long lists (e.g. countries, cities)
 * - Full keyboard navigation (Arrows, Enter, Escape, Home, End, Type-ahead)
 * - ARIA combobox / listbox pattern
 * - Viewport-bounded portal rendering (no modal clipping or overflow cutoff)
 * - 100% backward-compatible event signature for existing onChange handlers
 */
export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  onValueChange,
  options: propOptions,
  children,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  className = "",
  panelClassName = "",
  variant = "default",
  searchable,
  searchPlaceholder = "Search...",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  // Parse options from either `options` prop or `<option>` children
  const options: CustomSelectOption[] = React.useMemo(() => {
    if (propOptions && Array.isArray(propOptions)) {
      return propOptions;
    }
    if (children) {
      const extracted: CustomSelectOption[] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const props = child.props as {
            value?: string | number;
            disabled?: boolean;
            children?: ReactNode;
          };
          if (props.value !== undefined) {
            extracted.push({
              value: props.value,
              label:
                typeof props.children === "string"
                  ? props.children
                  : String(props.value),
              disabled: Boolean(props.disabled),
            });
          }
        }
      });
      return extracted;
    }
    return [];
  }, [propOptions, children]);

  // Internal selection state
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | number>(
    defaultValue !== undefined ? defaultValue : ""
  );
  const selectedValue = isControlled ? controlledValue : internalValue;

  // Find currently selected option
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(selectedValue)
  );

  // Open/closed state
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);

  // Position state for portal
  const [panelCoords, setPanelCoords] = useState<{
    top: number;
    left: number;
    width: number;
    opensUp: boolean;
  }>({
    top: 0,
    left: 0,
    width: 240,
    opensUp: false,
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLUListElement | null>(null);

  // Track hydration for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery]);

  // Auto-enable search for lists with 8 or more items unless explicitly set
  const isSearchable =
    searchable !== undefined ? searchable : options.length >= 8;

  // Calculate coordinates and bounds within viewport
  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const estimatedPanelHeight = Math.min(320, options.length * 38 + 60);
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const opensUp = spaceBelow < 220 && spaceAbove > spaceBelow;

    // Width matching trigger or comfortable min-width on small screens
    const computedWidth = Math.max(rect.width, 220);
    const finalWidth = Math.min(computedWidth, viewportWidth - 24);

    // Clamp horizontally to stay within viewport
    let left = rect.left;
    if (left + finalWidth > viewportWidth - 12) {
      left = viewportWidth - finalWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    const top = opensUp
      ? Math.max(12, rect.top - estimatedPanelHeight - 6)
      : Math.min(viewportHeight - 60, rect.bottom + 6);

    setPanelCoords({
      top,
      left,
      width: finalWidth,
      opensUp,
    });
  }, [options.length]);

  // Reposition on resize and modal/window scroll
  useEffect(() => {
    if (!isOpen) return;

    updatePanelPosition();

    const handleScroll = () => {
      updatePanelPosition();
    };
    const handleResize = () => {
      updatePanelPosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, updatePanelPosition]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Select an option
  const selectOption = useCallback(
    (option: CustomSelectOption) => {
      if (option.disabled) return;

      if (!isControlled) {
        setInternalValue(option.value);
      }

      // Dispatch synthetic ChangeEvent matching native <select>
      if (onChange) {
        const syntheticEvent = {
          target: {
            name: name || selectId,
            value: String(option.value),
            id: selectId,
          },
          currentTarget: {
            name: name || selectId,
            value: String(option.value),
            id: selectId,
          },
        } as unknown as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }

      if (onValueChange) {
        onValueChange(String(option.value));
      }

      setIsOpen(false);
      setSearchQuery("");
      triggerRef.current?.focus();
    },
    [isControlled, name, selectId, onChange, onValueChange]
  );

  // Open the select panel
  const openPanel = useCallback(() => {
    if (disabled) return;
    updatePanelPosition();
    setIsOpen(true);
    setSearchQuery("");

    // Set initial highlighted index to current selected item
    const currentIndex = filteredOptions.findIndex(
      (opt) => String(opt.value) === String(selectedValue)
    );
    setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
  }, [disabled, updatePanelPosition, filteredOptions, selectedValue]);

  // Close the select panel
  const closePanel = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
    triggerRef.current?.focus();
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && isSearchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSearchable]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const items = listboxRef.current.querySelectorAll("[role='option']");
      const activeEl = items[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault();
        openPanel();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closePanel();
        break;

      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev + 1 >= filteredOptions.length ? 0 : prev + 1;
          return next;
        });
        break;
      }

      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1;
          return next;
        });
        break;
      }

      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;

      case "End":
        e.preventDefault();
        setHighlightedIndex(filteredOptions.length - 1);
        break;

      case "Enter": {
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      }

      case "Tab":
        // Allow default tab behavior to advance focus, but close panel
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  // Base Trigger Styles
  const defaultTriggerClasses =
    "w-full h-[46px] rounded-xl bg-[#202020] hover:bg-[#252525] border border-white/10 px-4 font-sans font-medium text-[14px] text-white cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between";

  const underlineTriggerClasses =
    "bg-transparent border-0 border-b border-white/30 font-semibold text-white px-1 pb-0.5 outline-none focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-white cursor-pointer tabular-nums transition-colors inline-flex items-center gap-1.5 whitespace-nowrap";

  const sentenceTriggerClasses =
    "bg-transparent border-0 border-b-[2px] border-white/30 hover:border-white/50 focus:border-[#6b62f2] focus:shadow-[0_2px_8px_-2px_rgba(107,98,242,0.6)] focus-visible:border-[#6b62f2] focus-visible:shadow-[0_2px_8px_-2px_rgba(107,98,242,0.6)] focus:outline-none focus-visible:outline-none px-1 pb-0.5 transition-all duration-200 inline-flex items-center align-baseline cursor-pointer text-left";

  const triggerClasses =
    variant === "sentence"
      ? `${sentenceTriggerClasses} ${className}`
      : variant === "underline"
      ? `${underlineTriggerClasses} ${className}`
      : className
      ? `${defaultTriggerClasses} ${className}`
      : defaultTriggerClasses;

  return (
    <div
      className={`relative ${
        variant === "underline" || variant === "sentence"
          ? "inline-block align-baseline"
          : "inline-block w-full"
      }`}
    >
      {/* Hidden native input for standard form submission */}
      <input
        type="hidden"
        name={name}
        value={selectedValue !== undefined ? String(selectedValue) : ""}
        required={required}
      />

      {/* Accessible Trigger Button */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => {
          if (isOpen) {
            closePanel();
          } else {
            openPanel();
          }
        }}
        onKeyDown={handleKeyDown}
        className={triggerClasses}
      >
        <span
          className={
            variant === "sentence"
              ? selectedOption
                ? "bg-gradient-to-r from-[#8ba8ff] via-[#6b62f2] to-[#c084fc] bg-clip-text text-transparent"
                : "text-white/40 font-normal"
              : `truncate ${selectedOption ? "text-white" : "text-white/50"}`
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {variant === "sentence" ? (
          <ChevronDown
            className={`w-4 h-4 md:w-5 md:h-5 text-white/50 transition-transform duration-200 shrink-0 ml-1 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        ) : variant === "underline" ? (
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        ) : (
          <div className="pointer-events-none flex items-center pl-2 text-white/70 shrink-0">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </div>
        )}
      </button>

      {/* Floating Dropdown Panel (Portaled to document.body) */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: `${panelCoords.top}px`,
              left: `${panelCoords.left}px`,
              width: `${panelCoords.width}px`,
              zIndex: 99999,
            }}
            className={`bg-[#12131a]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.15)] p-1.5 flex flex-col gap-1 text-white animate-in fade-in-0 zoom-in-95 duration-150 ${panelClassName}`}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input for Long Lists */}
            {isSearchable && (
              <div className="relative p-1 border-b border-white/[0.08] mb-0.5">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 pl-8 pr-7 bg-white/[0.06] border border-white/10 rounded-lg text-white font-sans text-[13px] placeholder:text-white/40 outline-none focus:outline-none focus-visible:outline-none focus:border-[#6b62f2] focus:shadow-[0_0_0_2px_rgba(107,98,242,0.3)] transition-all duration-150"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setHighlightedIndex(0);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-0.5 rounded cursor-pointer"
                    aria-label="Clear search query"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Option List */}
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-label={ariaLabel || placeholder}
              className="thin-scrollbar overflow-y-auto max-h-[240px] flex flex-col gap-0.5 p-0.5 m-0 list-none focus:outline-none"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-4 text-center text-[13px] text-white/50 font-sans">
                  No matching options
                </li>
              ) : (
                filteredOptions.map((option, idx) => {
                  const isSelected =
                    String(option.value) === String(selectedValue);
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <li
                      key={String(option.value)}
                      id={`${selectId}-opt-${String(option.value)}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onClick={() => selectOption(option)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`relative px-3 py-2 rounded-xl text-[14px] font-sans flex items-center justify-between cursor-pointer select-none transition-colors duration-100 ${
                        option.disabled
                          ? "opacity-40 cursor-not-allowed text-white/40"
                          : isSelected
                          ? "bg-[#6b62f2]/25 text-white font-medium border-l-2 border-[#6b62f2]"
                          : isHighlighted
                          ? "bg-white/[0.12] text-white"
                          : "text-white/85 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <Check
                          className="w-4 h-4 text-[#6b62f2] shrink-0 ml-2"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};
