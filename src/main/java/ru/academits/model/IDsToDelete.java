package ru.academits.model;

import java.util.Arrays;

public class IDsToDelete {
    private int [] iDs;

    public int[] getiDs() {
        return iDs;
    }

    public void setiDs(int[] iD) {
        this.iDs = iD;
    }

    @Override
    public String toString() {
        return "IDsToDelete{" +
                "iDs=" + Arrays.toString(iDs) +
                '}';
    }
}
