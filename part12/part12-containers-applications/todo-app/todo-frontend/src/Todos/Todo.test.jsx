import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Todo from "./Todo";
import { vi, test, expect } from "vitest"; //Surprisingly big pain in the ass to use jest here instead of vitest..

describe("Todo component", () => {
    const mockDelete = vi.fn();
    const mockComplete = vi.fn();

    const todoNotDone = {
        _id: "123",
        text: "Test incomplete todo",
        done: false,
    };

    const todoDone = {
        _id: "456",
        text: "Test complete todo",
        done: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders an incomplete todo and calls handlers correctly", () => {
        render(
            <Todo
                todo={todoNotDone}
                deleteTodo={mockDelete}
                completeTodo={mockComplete}
            />,
        );

        expect(screen.getByText("Test incomplete todo")).toBeInTheDocument();
        expect(screen.getByText("This todo is not done")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Delete"));
        expect(mockDelete).toHaveBeenCalledWith(todoNotDone);

        fireEvent.click(screen.getByText("Set as done"));
        expect(mockComplete).toHaveBeenCalledWith(todoNotDone);
    });

    test("renders a completed todo and calls delete handler only", () => {
        render(
            <Todo
                todo={todoDone}
                deleteTodo={mockDelete}
                completeTodo={mockComplete}
            />,
        );

        expect(screen.getByText("Test complete todo")).toBeInTheDocument();
        expect(screen.getByText("This todo is done")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Delete"));
        expect(mockDelete).toHaveBeenCalledWith(todoDone);
        expect(mockComplete).not.toHaveBeenCalled();
    });

    /* Force fail for testing purposes*/
    //test("this test will fail", () => {
    //    expect(true).toBe(false);
    //});
});
